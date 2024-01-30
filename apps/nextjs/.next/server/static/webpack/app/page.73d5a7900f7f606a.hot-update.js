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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   api: () => (/* binding */ api)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(rsc)/../../node_modules/next/dist/compiled/react/react.shared-subset.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/../../node_modules/next/dist/esm/api/headers.js\");\n/* harmony import */ var _acme_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @acme/api */ \"(rsc)/../../packages/api/src/index.ts\");\n\n\n\n/**\n * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when\n * handling a tRPC call from a React Server Component.\n */ const createContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.cache)(async ()=>{\n    const heads = new Headers((0,next_headers__WEBPACK_IMPORTED_MODULE_1__.headers)());\n    heads.set(\"x-trpc-source\", \"rsc\");\n    return (0,_acme_api__WEBPACK_IMPORTED_MODULE_2__.createTRPCContext)({\n        headers: heads\n    });\n});\nconst api = (0,_acme_api__WEBPACK_IMPORTED_MODULE_2__.createCaller)(createContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvdHJwYy9zZXJ2ZXIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE4QjtBQUNTO0FBRXFCO0FBRTVEOzs7Q0FHQyxHQUNELE1BQU1JLGdCQUFnQkosNENBQUtBLENBQUM7SUFDMUIsTUFBTUssUUFBUSxJQUFJQyxRQUFRTCxxREFBT0E7SUFDakNJLE1BQU1FLEdBQUcsQ0FBQyxpQkFBaUI7SUFFM0IsT0FBT0osNERBQWlCQSxDQUFDO1FBQ3ZCRixTQUFTSTtJQUNYO0FBQ0Y7QUFFTyxNQUFNRyxNQUFNTix1REFBWUEsQ0FBQ0UsZUFBZSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvdHJwYy9zZXJ2ZXIudHM/M2ZmYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYWNoZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgaGVhZGVycyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcblxuaW1wb3J0IHsgY3JlYXRlQ2FsbGVyLCBjcmVhdGVUUlBDQ29udGV4dCB9IGZyb20gXCJAYWNtZS9hcGlcIjtcblxuLyoqXG4gKiBUaGlzIHdyYXBzIHRoZSBgY3JlYXRlVFJQQ0NvbnRleHRgIGhlbHBlciBhbmQgcHJvdmlkZXMgdGhlIHJlcXVpcmVkIGNvbnRleHQgZm9yIHRoZSB0UlBDIEFQSSB3aGVuXG4gKiBoYW5kbGluZyBhIHRSUEMgY2FsbCBmcm9tIGEgUmVhY3QgU2VydmVyIENvbXBvbmVudC5cbiAqL1xuY29uc3QgY3JlYXRlQ29udGV4dCA9IGNhY2hlKGFzeW5jICgpID0+IHtcbiAgY29uc3QgaGVhZHMgPSBuZXcgSGVhZGVycyhoZWFkZXJzKCkpO1xuICBoZWFkcy5zZXQoXCJ4LXRycGMtc291cmNlXCIsIFwicnNjXCIpO1xuXG4gIHJldHVybiBjcmVhdGVUUlBDQ29udGV4dCh7XG4gICAgaGVhZGVyczogaGVhZHMsXG4gIH0pO1xufSk7XG5cbmV4cG9ydCBjb25zdCBhcGkgPSBjcmVhdGVDYWxsZXIoY3JlYXRlQ29udGV4dCk7XG4iXSwibmFtZXMiOlsiY2FjaGUiLCJoZWFkZXJzIiwiY3JlYXRlQ2FsbGVyIiwiY3JlYXRlVFJQQ0NvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwiaGVhZHMiLCJIZWFkZXJzIiwic2V0IiwiYXBpIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/trpc/server.ts\n");

/***/ })

});