module.exports.humanConfig = {
  modelBasePath: "file://public/models/",
  face: {
    enabled: true,
    detector: { enabled: true, rotation: false },
    mesh: { enabled: true },
    iris: { enabled: true },
    description: { enabled: true },
    emotion: { enabled: false },
  },
  body: {
    enabled: false,
  },
  hand: {
    enabled: false,
  },
  object: {
    enabled: false,
  },
  videoOptimized: false,
  // TODO: check if this can be optimized in any way
  filter: {
    enabled: true,
    width: 640,
    height: 480,
  },
};
