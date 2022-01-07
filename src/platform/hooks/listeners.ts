import { App } from '@capacitor/app';
import { useCallback, useEffect } from 'react';
import { EEvent } from 'shared/enums';

function useDocumentListener(event: EEvent, callback: (p?: any) => any, apply = true) {
	useEffect(() => {
		if (apply) {
			document.addEventListener(event, callback);
		}

		return () => {
			if (apply) {
				document.removeEventListener(event, callback);
			}
		};
	}, [apply, event, callback]);
}

function useWindowListener(event: EEvent, callback: (p?: any) => any, apply = true) {
	useEffect(() => {
		if (apply) {
			window.addEventListener(event, callback);
		}

		return () => {
			if (apply) {
				window.removeEventListener(event, callback);
			}
		};
	}, [apply, event, callback]);
}

function useCloseListener(
	show: boolean,
	onClose: () => void,
	mainRef: React.MutableRefObject<any>,
	externalRef?: React.MutableRefObject<any>,
	escape: boolean = true
) {
	const handleCloseCallback = useCallback(
		e => {
			if (
				e.key === 'Escape' ||
				(mainRef.current &&
					!mainRef.current?.contains(e.target) &&
					externalRef &&
					externalRef.current &&
					!externalRef.current?.contains(e.target))
			) {
				if (show) {
					onClose();
				}
			}
		},
		[show, onClose, mainRef, externalRef]
	);
	useDocumentListener(EEvent.MOUSEDOWN, handleCloseCallback);
	useDocumentListener(EEvent.KEYDOWN, handleCloseCallback, escape);
}

async function useAndroidBack(callback) {
	return useEffect(() => {
		App.addListener(EEvent.ANDROID_BACK, callback);

		return () => {
			App.removeAllListeners();
		};
	}, [callback]);
}

export { useAndroidBack, useCloseListener, useDocumentListener, useWindowListener };