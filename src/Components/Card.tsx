import { ReactNode } from "react";

interface Card {
    children: ReactNode;
    title: string;
}

function Card({children, title}) {
	return (
    <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">{title}</h2>
            {children}
        </div>
    </div>
    );
}

export default Card;