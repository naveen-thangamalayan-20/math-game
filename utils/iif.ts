export const iif = <Return>(callBackFn: () => Return) => {
    return callBackFn()
}