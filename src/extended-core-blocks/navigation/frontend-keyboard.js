console.log("in frontend-keyboard.js");

/**
 * Handle navigation on the default and drawer nav
 *
 * This is for the top level, horzontal menu.
 * e.g. About Website Builder 🔽 | How to make a good website 🔽 | User guides 🔽
 */
// (() => {
// This is any default WP menu. also in the footer.
// const defaultNavs = document.querySelectorAll(
//   "nav.wp-block-navigation:not(.is-style-drawer):not(.is-style-detached)",
// );
const drawerNavs = document.querySelectorAll(
  "header nav.wp-block-navigation.is-style-drawer",
);
// const detachedNavs = document.querySelectorAll(
//   "header nav.wp-block-navigation.is-style-detached",
// );

const drawerNavLevel1Targets = [];
const drawerNavLevel2Targets = [];

drawerNavs.forEach((nav) => {
  drawerNavLevel1Targets.push(
    ...Array.from(
      nav.querySelectorAll(
        ":scope > ul > li > .wp-block-navigation-item__content",
      ),
    ),
  );
  drawerNavLevel2Targets.push(
    ...Array.from(
      nav.querySelectorAll(
        ":scope > ul > li > ul > li > .wp-block-navigation-item__content",
      ),
    ),
  );
});

const drawerNavLevel1 = {
  targets: drawerNavLevel1Targets,
  handlerHorizontal: (target, direction) => {
    // Handle the left and right keys, only on large screens.

    // Go up to the closest li
    const parent = target.parentElement;

    if (!parent.matches("li")) {
      return;
    }

    // then go to next or previous li
    const li =
      direction === "right"
        ? parent.nextElementSibling
        : parent.previousElementSibling;

    // then drill down to > .wp-block-navigation-item__content
    const aOrButton = li?.querySelector(
      ":scope > .wp-block-navigation-item__content",
    );

    aOrButton?.focus();
  },
  handlerVertical: (target, direction) => {
    // Go up to the closest li
    if (
      !target.matches(
        'button[aria-expanded][data-wp-on--click="actions.toggleMenuOnClick"]',
      )
    ) {
      return;
    }

    const isOpen = target.matches('[aria-expanded="true"]');

    if (isOpen && direction === "up") {
      target.click();
    }

    if (!isOpen && direction === "down") {
      target.click();
    }

    if (isOpen && direction === "down") {
      // Focus on the first item in the submenu
      target.parentElement
        .querySelector(
          ":scope > ul.wp-block-navigation-submenu > li > .wp-block-navigation-item__content",
        )
        .focus();
    }
  },
};

const drawerNavLevel2 = {
  targets: drawerNavLevel2Targets,
  handler: (target, direction) => {
    console.log("in drawerNavLevel2 handler");
    // Map out the position of the elements.

    // Get the parent element, the grid
    const parentList = target.parentElement.parentElement;

    if (!parentList.matches("ul.wp-block-navigation-submenu")) {
      return;
    }

    // Loop through every child and create a 3d array based on it's vertical position.
    const menuItems = Array.from(parentList.querySelectorAll(":scope > li"));

    // Which index is the current nav item in the DOM?
    const index = menuItems.indexOf(target.parentElement);

    const locationMap2 = mapElementsToArray(menuItems);

    const currentPosition = locationMap2[index];

    const move = {
      left: [-1, 0],
      up: [0, -1],
      right: [1, 0],
      down: [0, 1],
    }[direction];

    const newPosition = [
      currentPosition[0] + move[0],
      currentPosition[1] + move[1],
    ];

    const newIndex = locationMap2.findIndex(
      (l) => l[0] === newPosition[0] && l[1] === newPosition[1],
    );

    if (newIndex !== -1 && menuItems[newIndex]) {
      menuItems[newIndex]
        .querySelector(":scope > .wp-block-navigation-item__content")
        .focus();
      return;
    }
    if (direction === "up") {
      // We have reached the to, so move focus to the level1 button.
      parentList.parentElement
        .querySelector(".wp-block-navigation-submenu__toggle")
        .focus();
      return;
    }
  },
};

const myHandleKeydown = (e) => {
  const element = e.target;

  if (e.keyCode < 37 || e.keyCode > 40) {
    return;
  }

  const direction = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  }[e.keyCode];

  if (drawerNavLevel1.targets.includes(e.target)) {
    // We don't want the page to scroll.
    e.preventDefault();

    if (["left", "right"].includes(direction)) {
      drawerNavLevel1.handlerHorizontal(e.target, direction);
    } else {
      drawerNavLevel1.handlerVertical(e.target, direction);
    }
    return;
  }

  if (drawerNavLevel2.targets.includes(e.target)) {
    // We don't want the page to scroll.
    e.preventDefault();

    drawerNavLevel2.handler(e.target, direction);
    return;
  }
};

document.addEventListener("keydown", myHandleKeydown);

const mapElementsToArray = (elements) => {
  const workingLocationMap = [];

  let i = 0;
  let currentY;
  let currentRow = 0;
  let currentColumn = 0;
  for (const item of elements) {
    const itemY = item.getBoundingClientRect().y;

    if (i > 0 && itemY !== currentY) {
      // Reset the column and move down a row, similar to how a typewriter carriage returns
      currentColumn = 0;
      currentRow++;
    }

    workingLocationMap.push([currentColumn, currentRow]);
    currentColumn++;

    currentY = itemY;
    i++;
  }

  return workingLocationMap;
};

// Dev
// window.onload = (event) => {
//   console.log("page is fully loaded");

//   // Debug testing.
//   // drawerNavLevel1Targets[0].focus();
//   drawerNavLevel1Targets[0].click();

//   const testingTarget = drawerNavLevel2Targets[3];
//   drawerNavLevel2.handler(testingTarget, "down");

//   drawerNavLevel2Targets[0].focus();
// };
