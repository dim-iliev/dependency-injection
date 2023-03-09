import { Container } from "./../type.d";
import { createContainer } from "./../index";

describe("Create di container", () => {
  let di: Container;

  beforeEach(() => {
    di = createContainer();
  });

  it("can create empty di container and resolve `null` instances without throwing an error", () => {
    const di = createContainer();

    expect(di.resolve("app")).toBeNull();
  });

  it("can inject empty dependecies in methods without throwing an error", () => {
    const method = jest.fn(() => {});

    const injectedMethod = di.inject(method, ["app"]);
    injectedMethod();
    expect(method).toBeCalledWith(null);
  });

  it("can create a di container and resolve an instance", () => {
    const di = createContainer();

    class App {}
    const _app = new App();

    di.persistent("app", () => _app);

    expect(di.resolve("app")).toBe(_app);
  });

  it("can create a di container and resolve an instance that depdends on another instance", () => {
    const fooMock = jest.fn();
    const barMock = jest.fn();

    class App {}
    const _app = new App();

    di.persistent(
      "app",
      (foo: App) => {
        fooMock(foo);
        return _app;
      },
      ["foo"]
    );

    di.persistent(
      "foo",
      (bar: number) => {
        barMock(bar);
        return 2 * bar;
      },
      ["bar"]
    );

    di.persistent("bar", () => 2);

    expect(di.resolve("app")).toBe(_app);
    expect(fooMock).toBeCalledWith(4);
    expect(barMock).toBeCalledWith(2);
  });

  it("calls factory methods only when needed", () => {
    const di = createContainer();
    const mockedFactory = jest.fn(() => Math.random());
    di.transient("foo", mockedFactory);
    di.transient("bar", mockedFactory);

    expect(mockedFactory).toHaveBeenCalledTimes(0);
    expect(di.resolve("foo")).toEqual(di.resolve("foo"));
    expect(mockedFactory).toHaveBeenCalledTimes(1);
    expect(di.resolve("bar")).toEqual(di.resolve("bar"));
    expect(mockedFactory).toHaveBeenCalledTimes(2);
    expect(di.resolve("foo")).not.toEqual(di.resolve("bar"));
    expect(mockedFactory).toHaveBeenCalledTimes(2);
  });

  it("can create scoped instances", () => {
    const di = createContainer();
    const mockedFactory = jest.fn(() => Math.random());
    di.transient("foo", mockedFactory);
    di.transient("bar", mockedFactory);

    expect(di.resolve("foo")).toEqual(di.resolve("foo"));
    expect(di.resolve("bar")).toEqual(di.resolve("bar"));
    expect(di.resolve("foo")).not.toEqual(di.resolve("bar"));

    const scopedDi = di.scoped();

    expect(scopedDi.resolve("foo")).toEqual(scopedDi.resolve("foo"));
    expect(scopedDi.resolve("bar")).toEqual(scopedDi.resolve("bar"));
    expect(scopedDi.resolve("foo")).not.toEqual(di.resolve("foo"));
    expect(scopedDi.resolve("bar")).not.toEqual(di.resolve("bar"));
  });

  it("persitent instances don't change after scoping", () => {
    const di = createContainer();
    const mockedFactory = jest.fn(() => Math.random());

    di.persistent("foo", mockedFactory);

    expect(mockedFactory).toBeCalledTimes(0);
    expect(di.resolve("foo")).toEqual(di.resolve("foo"));
    expect(mockedFactory).toBeCalledTimes(1);

    mockedFactory.mockReset();
    mockedFactory.mockImplementation(() => Math.random());

    const scoped = di.scoped();

    expect(mockedFactory).toBeCalledTimes(0);
    expect(scoped.resolve("bar")).toBeNull();
    expect(scoped.resolve("foo")).toEqual(scoped.resolve("foo"));
    expect(scoped.resolve("foo")).toEqual(di.resolve("foo"));
    // Instance value is already resolved in the original container, and does not change since it is 'persistent'
    expect(mockedFactory).toBeCalledTimes(0);
  });

  it("can overwrites persistent with transient instance", () => {
    const fooMockPersistent = jest.fn(() => "foo");
    const barMockTransient = jest.fn(() => "bar");
    di.persistent("foo", fooMockPersistent);
    di.transient("foo", barMockTransient);

    expect(fooMockPersistent).toBeCalledTimes(0);
    expect(barMockTransient).toBeCalledTimes(0);

    expect(di.resolve("foo")).toEqual("bar");

    expect(fooMockPersistent).toBeCalledTimes(0);
    expect(barMockTransient).toBeCalledTimes(1);
  });

  it("can overwrites transient with persistent instance", () => {
    const fooMockPersistent = jest.fn(() => "foo");
    const barMockTransient = jest.fn(() => "bar");

    di.transient("foo", barMockTransient);
    di.persistent("foo", fooMockPersistent);

    expect(fooMockPersistent).toBeCalledTimes(0);
    expect(barMockTransient).toBeCalledTimes(0);

    expect(di.resolve("foo")).toEqual("foo");

    expect(fooMockPersistent).toBeCalledTimes(1);
    expect(barMockTransient).toBeCalledTimes(0);
  });

  it("can disable instance overwrite", () => {
    const fooMockPersistent = jest.fn(() => "foo");
    const barMockTransient = jest.fn(() => "bar");

    di.disableOverwrite()
    di.persistent("foo", fooMockPersistent);
    di.transient("foo", barMockTransient);

    expect(fooMockPersistent).toBeCalledTimes(0);
    expect(barMockTransient).toBeCalledTimes(0);

    expect(di.resolve("foo")).toEqual("foo")

    expect(fooMockPersistent).toBeCalledTimes(1);
    expect(barMockTransient).toBeCalledTimes(0);

    const scoped = di.scoped()
    scoped.transient("foo", barMockTransient);
    
    expect(scoped.resolve("foo")).toEqual("foo");

    expect(fooMockPersistent).toBeCalledTimes(1);
    expect(barMockTransient).toBeCalledTimes(0);
  });
});
