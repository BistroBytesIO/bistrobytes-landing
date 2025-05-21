import ReactPlayer from 'react-player/lazy';

export default function VideoSection() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-bistro-primary mb-6 text-center">
                In This Demo You'll Discover...
            </h2>

            <div className="aspect-w-16 aspect-h-9 mb-8 bg-gray-100 rounded-lg overflow-hidden">
                <ReactPlayer
                    url="/src/assets/demo.mp4"
                    width="100%"
                    height="100%"
                    controls={true}
                    light={true}
                    playIcon={<button className="bg-bistro-primary text-white rounded-full p-4">Play Demo</button>}
                />
            </div>

            <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                    <span className="text-bistro-primary mr-2">✓</span>
                    <span>How BistroBytes helps you take back control of your restaurant's digital presence</span>
                </li>
                <li className="flex items-start">
                    <span className="text-bistro-primary mr-2">✓</span>
                    <span>A seamless ordering system designed specifically for your restaurant's unique needs</span>
                </li>
                <li className="flex items-start">
                    <span className="text-bistro-primary mr-2">✓</span>
                    <span>Why restaurant owners are switching from delivery apps to custom solutions</span>
                </li>
            </ul>
        </div>
    );
}