import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parse, addMinutes, isBefore } from 'date-fns';

export default function CalendarPickerWithAvailability({ onSubmit, formData }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const availableDays = [1, 2, 3, 4, 5]; // Monday to Friday

    // Fetch real availability when a date is selected
    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        }

        const fetchAvailability = async () => {
            setLoadingSlots(true);
            try {
                const dateString = format(selectedDate, 'yyyy-MM-dd');
                const response = await fetch(`/.netlify/functions/get-availability?date=${dateString}`);
                const data = await response.json();
                
                if (data.success) {
                    setTimeSlots(data.slots);
                } else {
                    throw new Error(data.error || 'Failed to fetch availability');
                }
            } catch (err) {
                console.error('Error fetching availability:', err);
                // Fallback to default time slots if API fails
                setTimeSlots(generateDefaultTimeSlots());
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [selectedDate]);

    // Fallback time slot generation
    const generateDefaultTimeSlots = () => {
        const slots = [];
        const startHour = 9;
        const endHour = 17;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push({
                    time: timeString,
                    isAvailable: true // Default to available if we can't check
                });
            }
        }
        
        return slots;
    };

    // All the render methods remain the same as the previous version...
    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="text-gray-600 hover:text-bistro-primary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-lg font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="text-gray-600 hover:text-bistro-primary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = 'EEEEEE';
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="font-medium text-center text-sm py-2">
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const dayOfWeek = day.getDay();
                const cloneDay = new Date(day);
                const dateString = format(day, 'yyyy-MM-dd');

                const isAvailable = availableDays.includes(dayOfWeek) && isSameMonth(day, monthStart);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());

                days.push(
                    <div
                        key={dateString}
                        className={`relative p-2 border border-gray-100 min-h-[50px] ${isSameMonth(day, monthStart) ? 'text-gray-900' : 'text-gray-400'
                            } ${isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                    >
                        <div className="text-right text-xs">{formattedDate}</div>
                        {isAvailable && !isPast && (
                            <button
                                onClick={() => setSelectedDate(cloneDay)}
                                className={`absolute inset-0 w-full h-full ${isSelected
                                        ? 'bg-bistro-primary text-white'
                                        : 'hover:bg-bistro-primary/10'
                                    }`}
                                aria-label={`Select ${format(cloneDay, 'MMMM d, yyyy')}`}
                            >
                            </button>
                        )}
                        {!isAvailable && (
                            <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
                        )}
                    </div>
                );

                day = addDays(day, 1);
            }

            rows.push(
                <div key={day} className="grid grid-cols-7">
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="mb-6">{rows}</div>;
    };

    const renderTimeSlots = () => {
        if (!selectedDate) return null;

        return (
            <div className="mt-6">
                <h3 className="font-medium mb-3 text-gray-700">
                    Select a Time for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {loadingSlots ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bistro-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map(({ time, isAvailable }) => (
                            <button
                                key={time}
                                onClick={() => isAvailable && setSelectedTime(time)}
                                disabled={!isAvailable}
                                className={`p-3 rounded text-center relative ${isAvailable
                                        ? selectedTime === time
                                            ? 'bg-bistro-primary text-white'
                                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                                        : 'cursor-not-allowed bg-gray-100'
                                    }`}
                            >
                                {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
                                {!isAvailable && (
                                    <div className="absolute inset-0 bg-gray-200 opacity-50 rounded"></div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedTime) {
            setError('Please select both a date and time');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const startDateTime = parse(
                `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`,
                'yyyy-MM-dd HH:mm',
                new Date()
            );

            const endDateTime = addMinutes(startDateTime, 30);

            const response = await fetch('/.netlify/functions/create-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDateTime: startDateTime.toISOString(),
                    endDateTime: endDateTime.toISOString(),
                    customerName: formData.ownerName,
                    customerEmail: formData.email,
                    restaurantName: formData.restaurantName,
                    additionalNotes: formData.biggestChallenge,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to schedule appointment');
            }

            onSubmit({
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
                eventId: result.eventId,
                zoomMeetingId: result.zoomMeetingId,
                zoomJoinUrl: result.zoomJoinUrl
            });

        } catch (err) {
            console.error('Error booking appointment:', err);
            setError('Failed to schedule appointment. Please try again or contact us directly.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Schedule Your Free Consultation</h2>
            <p className="mb-6 text-gray-600">
                Select a convenient time for a 30-minute Zoom call where we'll discuss your specific needs
                and show you how BistroBytes can be customized for your restaurant.
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white border rounded-lg p-4 shadow-sm">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

            {selectedDate && renderTimeSlots()}

            <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || isLoading}
                className={`w-full mt-6 py-3 rounded-lg font-bold ${!selectedDate || !selectedTime || isLoading
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : 'bg-bistro-primary text-white hover:bg-opacity-90'
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scheduling...
                    </span>
                ) : (
                    'Schedule Consultation'
                )}
            </button>

            <p className="mt-4 text-sm text-gray-500">
                No payment required. This is a free consultation to explore how BistroBytes can help your restaurant.
            </p>
        </div>
    );
}