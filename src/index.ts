import diContainer from "./container"

const di = diContainer()

export const transient = di.transient
export const persistent = di.persistent
export const resolve = di.resolve
export const scoped = di.scoped
export const createContainer = diContainer;