
interface BadgeTitleProps {
	text: string;
	number: number;
}

function BadgeTitle({text, number}: BadgeTitleProps) {
	return (
			<h2 className="lg:text-lg font-bold flex flex-row gap-1 italic items-center">
				<div className="badge badge-primary badge-lg rounded">{number}</div>
				{text}
			</h2>
	);
}
export default BadgeTitle;