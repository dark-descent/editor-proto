import { observer } from "mobx-react";
import React from "react";
import { preventEvent } from "utils";
import { getClassFromProps } from "utils/react";
import { Modal as ModalStore , ModalManager, ModalOptions, withStore } from "../stores";
import { FlexBox, FlexItem, View } from "../views";

import "./styles/modal.scss";

const parse = (val: string | number) => typeof val === "number" ? val + "px" : val;

const parseStyle = (val: string | number | undefined, defaultVal?: string | number) => val === undefined ? (defaultVal === undefined ? undefined : parse(defaultVal)) : parse(val);

const parseStyleOptions = (options: ModalOptions): React.CSSProperties =>
{
	return {
		width: parseStyle(options.width, "60vw"),
		height: parseStyle(options.height, "65vh"),
		minHeight: parseStyle(options.minHeight, "480px"),
		minWidth: parseStyle(options.minWidth, "640px"),
		maxHeight: parseStyle(options.maxHeight, "960px"),
		maxWidth: parseStyle(options.maxWidth, "1280px"),
	};
}

const ModalContext = React.createContext<ModalStore | null>(null);

export const useModal = (): ModalStore =>
{
	const modal = React.useContext(ModalContext);
	if (!modal)
		throw new Error(`Component is not inside a modal!`);
	return modal;
}

export const Modal = withStore<ModalManager, { modal: ModalStore, isLast: boolean }>(ModalManager, ({ store, modal, isLast }) =>
{
	const { Component, title, options, canClose } = modal;
	
	const style = React.useMemo(() => parseStyleOptions(options), []);

	return (
		<View centered fixed className="modal" onClick={preventEvent} style={style}>
			<FlexBox fill vertical primary>
				<FlexItem base={64}>
					<View absolute fill className="title-bar">
						<View elType="h1" className="title">{title}</View>
						{options.closable && canClose() && <View absolute className="close-btn" onClick={modal.close}>
							<View fill className="inner-btn" />
						</View>}
					</View>
				</FlexItem>
				<FlexItem>
					<View absolute fill className="body">
						<ModalContext.Provider value={modal}>
							<Component />
						</ModalContext.Provider>
					</View>
				</FlexItem>
			</FlexBox>
			<View absolute fill className={getClassFromProps("blur-layer", { show: !isLast })} onClick={store.closeTopModal}/>
		</View>
	);
});