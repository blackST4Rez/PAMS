import UsefulLinks from './UsefulLinks';

const PageHeader = () => (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="shrink-0">
            <UsefulLinks />
        </div>
    </div>
);

export default PageHeader;