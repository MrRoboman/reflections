const states = [
  // 0
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    prompt: "Let's learn about light!",
    pupilPosition: null,
    rooms: [0],
    sightLineVisible: false,
    startButtonText: 'Start',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 1
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0],
    prompt: 'Look at the triangle in the middle of the room.',
    pupilPosition: null,
    sightLineVisible: true,
    startButtonText: '',
    startButtonVisible: false,
    target: null,
    toGetToNextState: 'clickTriangle',
    trianglePosition: null,
  },
  // 2
  {
    animatedLines: [
      {
        startX: ROOM_X,
        startY: 165,
        endX: ROOM_X,
        endY: 270,
        animation: {
          duration: 0.5,
          ease: 'power3.inOut',
          repeat: -1,
          repeatDelay: 0.5,
        },
      },
    ],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0],
    prompt: 'Great! Light reflects off the triangle into your eye.',
    pupilPosition: { x: 0, y: -1 },
    sightLineVisible: false,
    startButtonText: 'Add mirror',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 3
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0, 1],
    prompt: "Look at the triangle's reflection.",
    pupilPosition: null,
    sightLineVisible: true,
    startButtonText: '',
    startButtonVisible: false,
    target: null,
    toGetToNextState: 'clickTriangleReflection',
    trianglePosition: null,
  },
  // 4
  {
    animatedLines: [
      {
        startX: 535,
        startY: 165,
        endX: 475,
        endY: 225,
        animation: {
          duration: 0.5,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 415,
        startY: 165,
        endX: 475,
        endY: 225,
        animation: {
          duration: 0.5,
          ease: 'power3.inOut',
        },
      },
      {
        startX: 475,
        startY: 225,
        endX: 425,
        endY: 280,
        animation: {
          delay: 0.5,
          duration: 0.5,
          ease: 'power3.inOut',
        },
      },
    ],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0, 1],
    prompt:
      'Nice! What do you notice about the angles of the reflecting light?',
    pupilPosition: { x: 0.75, y: -0.75 },
    sightLineVisible: false,
    startButtonText: 'Next',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 5
  // {startX: 400, startY: 300, endX: 475, endY: 263.8211382113821}
  // {startX: 475, startY: 263.8211382113821, endX: 365.5, endY: 211}
  {
    animatedLines: [
      {
        startX: 365.5,
        startY: 211,
        endX: 475,
        endY: 263.8,
        animation: {
          duration: 0.1,
          ease: 'power3.inOut',
        },
        // style: 'dashed',
      },
      {
        startX: ROOM_X + ROOM_W * 1.5 - (365.5 - (ROOM_X - ROOM_W * 0.5)),
        startY: 211,
        endX: 475,
        endY: 263.8,
        animation: {
          duration: 0.1,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 475,
        startY: 263.8,
        endX: 430,
        endY: 286,
        animation: {
          duration: 0.1,
          ease: 'power3.inOut',
        },
      },
    ],
    canMoveTriangle: true,
    clickRects: null,
    rooms: [0, 1],
    prompt:
      "Make the eye look at the triangle's reflection by moving the triangle",
    pupilPosition: { x: 0.9, y: -0.45 },
    sightLineVisible: false,
    startButtonText: '',
    startButtonVisible: false,
    target: { x: 360, y: 208 },
    toGetToNextState: 'triangleOnTarget',
    trianglePosition: null,
  },
  // 6
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0, 1],
    prompt: 'What will happen if we add a second mirror?',
    pupilPosition: null,
    sightLineVisible: false,
    startButtonText: 'Add mirror',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 7
  {
    animatedLines: [],
    canMoveTriangle: true,
    clickRects: [
      {
        x: 95,
        y: 175,
        width: TRIANGLE_SIZE,
        height: TRIANGLE_SIZE,
      },
      {
        x: 695,
        y: 175,
        width: TRIANGLE_SIZE,
        height: TRIANGLE_SIZE,
      },
    ],
    rooms: [-3, -2, -1, 0, 1, 2, 3],
    prompt:
      'Two mirrors gives the impression of infinity. Move the triangle to see how its reflections move.',
    pupilPosition: null,
    sightLineVisible: false,
    startButtonText: 'Next',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 8
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: [
      {
        x: 100,
        y: 150,
        w: TRIANGLE_SIZE,
        h: TRIANGLE_SIZE,
      },
      // {
      //   x: 700,
      //   y: 150,
      //   w: TRIANGLE_SIZE,
      //   h: TRIANGLE_SIZE,
      // },
    ],
    rooms: [-3, -2, -1, 0, 1, 2, 3],
    prompt: 'Have the eye look at the triangle two reflections to the left.',
    pupilPosition: null,
    sightLineVisible: true,
    startButtonText: '',
    startButtonVisible: false,
    target: null,
    toGetToNextState: 'clickClickRect',
    trianglePosition: { x: ROOM_X, y: ROOM_Y },
  },
  // 9
  {
    animatedLines: [
      {
        startX: 419.5,
        startY: 151.3,
        endX: 475,
        endY: 180.5,
        animation: {
          duration: 0.75,
          ease: 'power3.inOut',
        },
      },
      {
        startX: 419.5 - ROOM_W * 2,
        startY: 151.3,
        endX: 475 - ROOM_W * 2,
        endY: 180.5,
        animation: {
          duration: 0.75,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 475,
        startY: 180.5,
        endX: 325,
        endY: 260.2,
        animation: {
          delay: 0.75,
          duration: 0.75,
          ease: 'power3.inOut',
        },
      },
      {
        startX: 475 - ROOM_W * 2,
        startY: 180.5,
        endX: 325,
        endY: 260.2,
        animation: {
          delay: 0.75,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 325,
        startY: 260.2,
        endX: 372.5,
        endY: 285,
        animation: {
          delay: 1.5,
          duration: 0.75,
          ease: 'power3.inOut',
        },
      },
    ],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [-3, -2, -1, 0, 1, 2, 3],
    prompt:
      'The triangle appears to be straight ahead, but we are seeing light reflect multiple times.',
    pupilPosition: { x: -0.8, y: -0.6 },
    sightLineVisible: false,
    startButtonText: 'Start over',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
]
