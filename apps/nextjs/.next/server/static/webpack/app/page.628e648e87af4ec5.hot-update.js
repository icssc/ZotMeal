"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(rsc)/./src/trpc/server.ts":
/*!****************************!*\
  !*** ./src/trpc/server.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   api: () => (/* binding */ api),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(rsc)/../../node_modules/next/dist/compiled/react/react.shared-subset.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/../../node_modules/next/dist/esm/api/headers.js\");\n/* harmony import */ var _acme_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @acme/api */ \"(rsc)/../../packages/api/src/index.ts\");\n\n\n\nconst runtime = \"nodejs\";\n/**\n * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when\n * handling a tRPC call from a React Server Component.\n */ const createContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.cache)(async ()=>{\n    const heads = new Headers((0,next_headers__WEBPACK_IMPORTED_MODULE_1__.headers)());\n    heads.set(\"x-trpc-source\", \"rsc\");\n    return (0,_acme_api__WEBPACK_IMPORTED_MODULE_2__.createTRPCContext)({\n        headers: heads\n    });\n});\nconst api = (0,_acme_api__WEBPACK_IMPORTED_MODULE_2__.createCaller)(createContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvdHJwYy9zZXJ2ZXIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBOEI7QUFDUztBQUVxQjtBQUVyRCxNQUFNSSxVQUFVLFNBQVM7QUFFaEM7OztDQUdDLEdBQ0QsTUFBTUMsZ0JBQWdCTCw0Q0FBS0EsQ0FBQztJQUMxQixNQUFNTSxRQUFRLElBQUlDLFFBQVFOLHFEQUFPQTtJQUNqQ0ssTUFBTUUsR0FBRyxDQUFDLGlCQUFpQjtJQUUzQixPQUFPTCw0REFBaUJBLENBQUM7UUFDdkJGLFNBQVNLO0lBQ1g7QUFDRjtBQUVPLE1BQU1HLE1BQU1QLHVEQUFZQSxDQUFDRyxlQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy90cnBjL3NlcnZlci50cz8zZmZjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNhY2hlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuXG5pbXBvcnQgeyBjcmVhdGVDYWxsZXIsIGNyZWF0ZVRSUENDb250ZXh0IH0gZnJvbSBcIkBhY21lL2FwaVwiO1xuXG5leHBvcnQgY29uc3QgcnVudGltZSA9IFwibm9kZWpzXCI7XG5cbi8qKlxuICogVGhpcyB3cmFwcyB0aGUgYGNyZWF0ZVRSUENDb250ZXh0YCBoZWxwZXIgYW5kIHByb3ZpZGVzIHRoZSByZXF1aXJlZCBjb250ZXh0IGZvciB0aGUgdFJQQyBBUEkgd2hlblxuICogaGFuZGxpbmcgYSB0UlBDIGNhbGwgZnJvbSBhIFJlYWN0IFNlcnZlciBDb21wb25lbnQuXG4gKi9cbmNvbnN0IGNyZWF0ZUNvbnRleHQgPSBjYWNoZShhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGhlYWRzID0gbmV3IEhlYWRlcnMoaGVhZGVycygpKTtcbiAgaGVhZHMuc2V0KFwieC10cnBjLXNvdXJjZVwiLCBcInJzY1wiKTtcblxuICByZXR1cm4gY3JlYXRlVFJQQ0NvbnRleHQoe1xuICAgIGhlYWRlcnM6IGhlYWRzLFxuICB9KTtcbn0pO1xuXG5leHBvcnQgY29uc3QgYXBpID0gY3JlYXRlQ2FsbGVyKGNyZWF0ZUNvbnRleHQpO1xuIl0sIm5hbWVzIjpbImNhY2hlIiwiaGVhZGVycyIsImNyZWF0ZUNhbGxlciIsImNyZWF0ZVRSUENDb250ZXh0IiwicnVudGltZSIsImNyZWF0ZUNvbnRleHQiLCJoZWFkcyIsIkhlYWRlcnMiLCJzZXQiLCJhcGkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/trpc/server.ts\n");

/***/ })

});