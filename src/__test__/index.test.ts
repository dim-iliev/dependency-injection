import { Container, Manifest } from './../type.d';
import { createContainer } from './../index';

describe('Create di container', () => {
  let di: Container

  beforeEach(() => {
    di = createContainer()
  })

  it("can create empty di container and resolve `null` instances without throwing an error", () => {
    const di = createContainer()

    expect(di.resolve("app")).toBeNull()
  })

  it("can inject empty dependecies in methods without throwing an error", () => {
    const method = jest.fn(() => {})

    const injectedMethod = di.inject(method, ["app"]);
    injectedMethod()
    expect(method).toBeCalledWith(null);
  })

  it("can create a di container and resolve an instance", () => {
    const di = createContainer();

    class App {}
    const _app = new App()

    di.persistent("app", () => _app);

    expect(di.resolve("app")).toBe(_app)
  });

    it("can create a di container and resolve an instance that depdends on another instance", () => {
      const di = createContainer();
      const fooMock = jest.fn()
      const barMock = jest.fn();

      class App {}
      const _app = new App();

      di.persistent("app", (foo: App) => {
        fooMock(foo);
        return _app
      }, ["foo"]);

      di.persistent("foo", (bar: number) => {
        barMock(bar)
        return 2 * bar
      }, ["bar"])

      di.persistent("bar", () => 2)

      expect(di.resolve("app")).toBe(_app);
      expect(fooMock).toBeCalledWith(4)
      expect(barMock).toBeCalledWith(2)
    });
})