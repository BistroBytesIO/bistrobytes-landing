export default function BulletPoints() {
    const points = [
        {
            title: "Why Third-Party Delivery Apps Are Draining Your Restaurant's Profits",
            description: "The average restaurant loses 15-30% of revenue to commission fees while struggling with inconsistent delivery quality and no ownership of customer data."
        },
        {
            title: 'The "Restaurant-First Technology" You Need To Implement',
            description: "Our lightweight, customizable ordering system puts your brand front and center while integrating seamlessly with your existing operations."
        },
        {
            title: "Why One-Size-Fits-All Ordering Platforms Are Holding You Back",
            description: "Most solutions aren't built for your specific restaurant workflow - we adapt to your business, not the other way around."
        },
        {
            title: "5 Ways BistroBytes Helps You Increase Order Value and Customer Retention",
            description: "From custom menu management to built-in marketing tools, our system is designed to maximize revenue while minimizing operational headaches."
        }
    ];

    return (
        <div className="space-y-6">
            {points.map((point, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-bistro-primary mb-2">{point.title}</h3>
                    <p className="text-gray-700">{point.description}</p>
                </div>
            ))}
        </div>
    );
}