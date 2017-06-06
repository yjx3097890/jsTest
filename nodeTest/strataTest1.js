function app(env, callback) {
  callback(200, {}, "Hello world!");
}

require("strata").run(app);