import tippy, {
	type ExtendedProps,
	hideOnEsc,
	hideOnPopperBlur,
	hideOthersOnOpen
} from './tippy-plugins';
import 'tippy.js/dist/tippy.css';

/**
 * A custom action to initialize tippy.js
 * @param node The DOM node to initialize tippy.js on
 * @param options The options to pass to tippy.js
 * @returns A tippy.js instance with an update and destroy method
 */
export default function tippyInit(node: HTMLElement, options: Partial<ExtendedProps>) {
	const plugins = [hideOnEsc, hideOnPopperBlur, hideOthersOnOpen];

	// Merge the plugins with the options
	const _options = options ? { ...options, plugins } : { plugins };

	const instance = tippy(node, _options);

	return {
		update(newOptions: Partial<ExtendedProps>) {
			const _newOptions = newOptions ? { ...newOptions, plugins } : { plugins };

			instance.setProps(_newOptions);
		},

		destroy() {
			instance.destroy();
		}
	};
}
