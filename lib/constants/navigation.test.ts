import assert from "node:assert/strict"
import test from "node:test"

import {
  isNavigationItemActive,
  navigationItems,
} from "./navigation.ts"

function getNavigationItem(title: string) {
  const item = navigationItems.find((navigationItem) => {
    return navigationItem.title === title
  })

  assert.ok(item, `Expected navigation item "${title}" to exist`)

  return item
}

test("Dashboard is only active on the exact dashboard route", () => {
  const dashboard = getNavigationItem("Dashboard")

  assert.equal(isNavigationItemActive(dashboard, "/dashboard"), true)
  assert.equal(isNavigationItemActive(dashboard, "/dashboard/hiring"), false)
})

test("Section items stay active for their nested routes", () => {
  const recommendations = getNavigationItem("Recommendations")
  const roleFamilies = getNavigationItem("Role Families")

  assert.equal(
    isNavigationItemActive(recommendations, "/dashboard/hiring"),
    true
  )
  assert.equal(
    isNavigationItemActive(roleFamilies, "/dashboard/roles/engineering"),
    true
  )
  assert.equal(
    isNavigationItemActive(recommendations, "/dashboard/roles"),
    false
  )
})
