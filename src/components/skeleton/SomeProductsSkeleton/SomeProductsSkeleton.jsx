import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SomeProductsSkeleton = () => {
    const commonProps = {
        baseColor: '#e5e7eb',
        highlightColor: '#f3f4f6',
    };

    return (
        <div className="p-4 sm:p-5">
            <div className="mb-4">
                {/* با استفاده از کلاس دارک مود روی Wrapper */}
                <div className="[&_span]:!bg-gray-200 dark:[&_span]:!bg-gray-700">
                    <Skeleton width={96} height={20} className="mb-2" />
                    <Skeleton width={128} height={16} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="[&_span]:!bg-gray-200 dark:[&_span]:!bg-gray-700">
                        <Skeleton className="aspect-square rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SomeProductsSkeleton