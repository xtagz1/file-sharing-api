/**
 * API Response Mode
 *
 * @package T
 */
export default class ApiResponse<T> {
	success: boolean;
	message: string | null;
	data: Object;

	/**
	 * Constructore
	 * @param success boolean
	 * @param message string | null
	 * @param data T | null
	 */
	constructor(
		success: boolean,
		message: string | null = null,
		data: T | null = null
	) {
		this.success = success;
		this.message = message;
		this.data = {
			result: data as T,
		};
	}

	public customResponse(data: {}): this {
		this.data = data;
		return this;
	}
}
