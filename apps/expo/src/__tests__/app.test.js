import React from "react";
import renderer from "react-test-renderer";

import { Logo } from "~/components/ui";

describe("<App />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<Logo />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
