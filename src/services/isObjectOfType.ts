import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

/**
 * isObjectOfType
 * a type guard to test and narrow type to a specific object/array type for better type flow control
 *
 * @example
 * function (x: {[index: string]: { test: string | null | undefined }}) {
 *  isObjectOfType<{[index: string]: { test: string}}>(x, _.isString) && x // we can confidently assume null | undefined part is stripped
 * }
 *
 */

const isObjectOfType = <TargetType>(
    inputObject: unknown,
    memberTestFunction: (inputObjectValue: unknown) => boolean
): inputObject is TargetType =>
    (isPlainObject(inputObject) || isArray(inputObject)) &&
    Object.entries(inputObject as Record<string, unknown>).every(([, value]) =>
        memberTestFunction(value)
    );
export default isObjectOfType;
