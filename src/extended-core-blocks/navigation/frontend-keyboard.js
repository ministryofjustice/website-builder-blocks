/**
 * Handle keyboard navigation for drawer navigation menus.
 *
 * Converts arrow key presses into directional navigation commands
 * and delegates to the appropriate level handler (level 1 or level 2).
 *
 * @param {KeyboardEvent} e - The keyboard event from the keydown listener.
 * @returns {void}
 */
const handleKeydown = (e) => {
  const { target, code } = e;

  const direction = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
  }[code];

  if (!direction) {
    return;
  }

  if (target.matches(drawerNavLevel1.selector)) {
    // We don't want the page to scroll.
    e.preventDefault();
    drawerNavLevel1.handler(target, direction);
  }

  if (target.matches(drawerNavLevel2.selector)) {
    e.preventDefault();
    drawerNavLevel2.handler(target, direction);
  }
};

document.addEventListener("keydown", handleKeydown);

/**
 * Config for handling navigation on the drawer nav top level (level 1)
 *
 * This is for the top level, horizontal menu.
 * e.g. About Website Builder 🔽 | How to make a good website 🔽 | User guides 🔽 | A link w/o dropdown
 */
const drawerNavLevel1 = {
  selector:
    "header nav.wp-block-navigation.is-style-drawer > ul > li > .wp-block-navigation-item__content",
  handlerHorizontal: function (target, direction) {
    // Go up to the parent element and confirm it an `li`
    const parent = target.parentElement;

    if (!parent.matches("li")) {
      return;
    }

    // Traverse to next or previous `li` element, depending on direction.
    const li =
      direction === "right"
        ? parent.nextElementSibling
        : parent.previousElementSibling;

    // Drill down to the UI element, it could be an `a` or `button` element. Then set focus.
    li?.querySelector(":scope > .wp-block-navigation-item__content")?.focus();
  },
  handlerVertical: function (target, direction) {
    // Confirm we are on an menu item that is 'click to toggle'.
    if (!target.matches('[data-wp-on--click="actions.toggleMenuOnClick"]')) {
      return;
    }

    const isDown = direction === "down";
    const isOpen = target.matches('[aria-expanded="true"]');

    // Either the menu is open and up was pressed. Or, the menu is closed and down was pressed.
    if (isOpen !== isDown) {
      // Toggle the drawer.
      target.click();
    }

    if (isOpen && isDown) {
      // Focus on the first item in the submenu
      target.parentElement
        .querySelector(
          ":scope > ul.wp-block-navigation-submenu > li > .wp-block-navigation-item__content",
        )
        .focus();
    }
  },
  handler: function (target, direction) {
    if (["left", "right"].includes(direction)) {
      this.handlerHorizontal(target, direction);
    } else {
      this.handlerVertical(target, direction);
    }
  },
};

/**
 * Config for handling navigation on the drawer nav submenu (level 2)
 *
 * This is for the 2nd level, responsive grid menu.
 * e.g.
 * Work with us     | Features         | Sites using Website Builder
 * Link 4           | Link 5           | Link 6
 */
const drawerNavLevel2 = {
  selector:
    "header nav.wp-block-navigation.is-style-drawer > ul > li > ul.wp-block-navigation-submenu > li > .wp-block-navigation-item__content",
  handler: (target, direction) => {
    // Define a move map, e.g. left is -1 on the x axis.
    const move = {
      left: [-1, 0],
      up: [0, -1],
      right: [1, 0],
      down: [0, 1],
    }[direction];

    // Get the grandparent element, the grid.
    const parentList = target.parentElement.parentElement;

    // From the grid, get the items.
    const menuItems = Array.from(parentList.querySelectorAll(":scope > li"));

    // Loop through every item and create an array based on the items [x, y] position.
    const positions = mapElementsToPositions(menuItems);

    // Which index is the current nav item in the DOM? e.g. Link 5 is index 4.
    const index = menuItems.indexOf(target.parentElement);

    // What is the position of the current nav item. e.g. Link 5 is [1, 1]
    const position = positions[index];

    // Calculate the now position based on the starting position and `move` value.
    // e.g. Link 5 with the up arrow will be [1, 1] + [0, -1] = [1, 0]
    const newPosition = [position[0] + move[0], position[1] + move[1]];

    // Based on the [x, y] position, work out the newIndex.
    // e.g. [1, 0] returns index of 1.
    const newIndex = positions.findIndex(
      (l) => l[0] === newPosition[0] && l[1] === newPosition[1],
    );

    // Did we find a newIndex to focus?
    if (newIndex !== -1 && menuItems[newIndex]) {
      menuItems[newIndex]
        .querySelector(":scope > .wp-block-navigation-item__content")
        .focus();
      return;
    }

    // Here, we did not find a place to move to, 
    // e.g. the up key was pressed at the top, or left key at the left edge.
    if (direction === "up") {
      // We have reached the top, so move focus to the level1 button.
      parentList.parentElement
        .querySelector(".wp-block-navigation-submenu__toggle")
        .focus();
    }
  },
};

/**
 * Map an array of DOM elements to their [x, y] grid positions based on visual layout.
 *
 * Calculates column (x) and row (y) positions by detecting when elements
 * wrap to a new line based on their vertical position in the viewport.
 *
 * @param {HTMLElement[]} elements - Array of DOM elements to map.
 * @returns {Array<[number, number]>} Array of [column, row] position tuples.
 *
 * @example
 * // For a 3-column grid with 5 items:
 * // [Item1] [Item2] [Item3]
 * // [Item4] [Item5]
 * // Returns: [[0,0], [1,0], [2,0], [0,1], [1,1]]
 */
const mapElementsToPositions = (elements) => {
  let currentY = null;
  let currentRow = 0;
  let currentColumn = 0;

  return elements.map((item) => {
    const itemY = Math.round(item.getBoundingClientRect().y);

    if (currentY !== null && itemY !== currentY) {
      // Reset the column and move down a row.
      currentColumn = 0;
      currentRow++;
    }

    const position = [currentColumn, currentRow];
    currentColumn++;
    currentY = itemY;

    return position;
  });
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
