"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export function useFocusMode(initialState: boolean = false) {
	const [isFocusMode, setIsFocusMode] = useState<boolean>(initialState);

	const openFocusMode = useCallback(() => setIsFocusMode(true), []);
	const closeFocusMode = useCallback(() => setIsFocusMode(false), []);
	const toggleFocusMode = useCallback(() => setIsFocusMode((v) => !v), []);

	return { isFocusMode, openFocusMode, closeFocusMode, toggleFocusMode };
}

export function FocusModal({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) {
	useEffect(() => {
		if (!isOpen) return;

		// Prevent body scroll while focus mode is active and close on Escape
		document.body.style.overflow = "hidden";
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = "";
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center"
			onClick={onClose}
		>
			{/* Dark backdrop */}
			<div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

			{/* Modal content - SIZE CONTROLLED HERE */}
			<div
				className="relative z-10 w-[80vw] h-[87vh] flex flex-col mx-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-20"
					aria-label="Close focus mode"
				>
					<svg
						className="w-8 h-8"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{/* Player container */}
				{children}
			</div>
		</div>,
		document.body
	);
}


