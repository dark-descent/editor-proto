import React from "react";
import { getClassFromProps } from "utils/react";
import { ModalManager, withStore } from "../stores";
import { View } from "../views";
import { Modal } from "./Modal";

export const ModalSpawner = withStore(ModalManager, ({ store }) => 
{
	const modalCount = store.modals.length;

	const cn = getClassFromProps("modal-spawner", {
		open: modalCount !== 0
	});

	const lastModalIndex = modalCount - 1;

	return (
		<View className={cn} fill fixed onClick={store.closeTopModal}>
			{store.modals.map((m, i) => <Modal key={i} modal={m} isLast={i === lastModalIndex} />)}
		</View>
	);
});