import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    title: string;
}

function Card({children, title} : CardProps) {
	return (
    <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
            <h2 className="card-title text-xl">{title}</h2>
            {children}
        </div>
    </div>
    );
}

export default Card;