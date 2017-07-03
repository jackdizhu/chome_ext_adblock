/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-2016 Eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

{
  let compare = Services.vc.compare;

  function allPairs(array)
  {
    let pairs = [];
    for (let i = 0; i < array.length - 1; i++)
      for (let j = i + 1; j < array.length; j++)
        pairs.push([array[i], array[j]]);
    return pairs;
  }

  function versionsEqual(versions)
  {
    allPairs(versions).forEach(pair =>
    {
      let v1 = pair[0];
      let v2 = pair[1];
      equal(compare(v1, v2), 0, "'" + v1 + "' should be equal to '" + v2 + "'");
    });
  }

  function versionSmaller(v1, v2)
  {
    equal(compare(v1, v2), -1,
          "'" + v1 + "' should be smaller than '" + v2 + "'");
    equal(compare(v2, v1), 1,
          "'" + v2 + "' should be larger than '" + v1 + "'");
  }

  module("Test utilities");
  test("allPairs", 1, () =>
  {
    deepEqual(allPairs([1, 2, 3]), [[1, 2], [1, 3], [2, 3]]);
  });

  module("versionComparator");

  test("Optional zero", 12, () =>
  {
    versionsEqual(["1", "1.0", "1.0.0", "1.0.0.0"]);
    versionsEqual(["1.a", "1.0a", "1.a0", "1.0a0"]);
  });

  test("+", 2, () =>
  {
    versionsEqual(["2pre", "1+"]);
    versionsEqual(["1.1pre", "1.0+"]);
  });

  test("*", 6, () =>
  {
    versionSmaller("1", "*");
    versionSmaller("1.1", "1.*");
    versionSmaller("1.*", "2");
  });

  test("Examples", 296, () =>
  {
    let examples = [
      "1.0+a",
      "1.0a",
      "1.0pre1",
      "1.0pre2",
      ["1.0", "1.0.0", "1.0.0.0"],
      ["1.1pre", "1.1pre0", "1.0+"],
      "1.1pre1a",
      "1.1pre1",
      "1.1pre10a",
      ["1.1pre10", "1.1pre010"],
      ["1.10", "1.010", "1.00010"],
    ];

    examples.forEach(example =>
    {
      if (example instanceof Array)
        versionsEqual(example);
    });

    allPairs(examples).forEach(pair =>
    {
      let v1 = [].concat(pair[0]);
      let v2 = [].concat(pair[1]);
      for (let i = 0; i < v1.length; i++)
        for (let j = 0; j < v2.length; j++)
          versionSmaller(v1[i], v2[j]);
    });
  });
}