import React from "react";
import { useModal } from "../components"

export const ProjectModal = () =>
{
	const modal = useModal();

	const [val, setVal] = React.useState("");

	return (
		<input value={val} onChange={e => setVal(e.target.value)} onKeyDown={(e) => { if (e.keyCode === 13) { modal.setTitle(val); setVal(""); } }} />
	);
}