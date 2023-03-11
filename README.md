### @dim.iliev/dependency-injection

Tiny and light weight depedency management library, with no external dependecies.
The library supports 2 types of instance registration

* `transient` - instances are re-created with a new scope, eg. web server handlers needs isolated new instance each time a route is requested
* `persistent` - return the same instance after a new scope is created, eg. a database connectiton with a pool, that is expensive to re-create with each request

### How to use:

```
import {persistent, resolve, transient} from "@dim.iliev/dependency-injection"

// Register a persistent instance

persistent("foo", () => "bar")

// Resolve registered dependecies
const myvar = resolve("foo")

// Register a transient instance
transient("secret", () => Math.random())

// Inject dependecies

// try to guess dependecies based on the variable name
persistent("baz", (foo) => {
  // do something here
})

// or explicitly declare dependecies
persistent("baz", fooInstance => {

}, ["foo"])
```

### Scopes

```
import {transient, resolve, scoped} from "@dim.iliev/dependency-injection"

transient("random", () => Math.random())
const di = scoped()

console.log("Random from different scopes", resolve("random") !== di.resolve("random"))
console.log("Random with the same scope", di.resolve("random") === di.resolve("random"))
console.log("Random with the global scope", resolve("random") === resolve("random"))

```

