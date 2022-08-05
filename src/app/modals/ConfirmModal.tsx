import { useModal } from "app/components";
import { Modal } from "app/stores";
import { Button, View } from "app/views";
import React from "react";

const ConfirmModal = () =>
{
	const modal = useModal();

	return (
		<View fill>
			{modal.openValue}
			<Button text="No" onClick={() => modal.close(false)}/>
			<Button text="Yes" onClick={() => modal.close(true)}/>
		</View>
	);
}

export const confirmModal = Modal.create({
	Component: ConfirmModal,
	title: "Delete Project?",
	maxWidth: 320,
	maxHeight: 220,
	minWidth: 320,
	minHeight: 220
});

export const confirm = (question: string): Promise<boolean> => confirmModal.open(question);