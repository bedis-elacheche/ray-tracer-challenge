Feature: Triangles

  Scenario: Constructing a triangle
    Given p1 ← point(0, 1, 0)
    And p2 ← point(-1, 0, 0)
    And p3 ← point(1, 0, 0)
    And t ← triangle(p1, p2, p3)
    Then t.p1 = p1
    And t.p2 = p2
    And t.p3 = p3
    And t.e1 = vector(-1, -1, 0)
    And t.e2 = vector(1, -1, 0)
    And t.normal = vector(0, 0, -1)

  Scenario: Intersecting a ray parallel to the triangle
    Given t ← triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0))
    And r ← ray(point(0, -1, -2), vector(0, 1, 0))
    When xs ← local_intersect(t, r)
    Then xs is empty

  Scenario: A ray misses the p1-p3 edge
    Given t ← triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0))
    And r ← ray(point(1, 1, -2), vector(0, 0, 1))
    When xs ← local_intersect(t, r)
    Then xs is empty

  Scenario: A ray misses the p1-p2 edge
    Given t ← triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0))
    And r ← ray(point(-1, 1, -2), vector(0, 0, 1))
    When xs ← local_intersect(t, r)
    Then xs is empty

  Scenario: A ray misses the p2-p3 edge
    Given t ← triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0))
    And r ← ray(point(0, -1, -2), vector(0, 0, 1))
    When xs ← local_intersect(t, r)
    Then xs is empty

  Scenario: A ray strikes a triangle
    Given t ← triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0))
    And r ← ray(point(0, 0.5, -2), vector(0, 0, 1))
    When xs ← local_intersect(t, r)
    Then xs.count = 1
    And xs[0].t = 2

  Scenario: Finding the normal on a triangle
    Given t ← triangle(point(0, 1, 0), point(-1, 0, 0), point(1, 0, 0))
    When n1 ← local_normal_at(t, point(0, 0.5, 0))
    And n2 ← local_normal_at(t, point(-0.5, 0.75, 0))
    And n3 ← local_normal_at(t, point(0.5, 0.25, 0))
    Then n1 = t.normal
    And n2 = t.normal
    And n3 = t.normal

  Scenario: A triangle has a bounding box
    Given p1 ← point(-3, 7, 2)
    And p2 ← point(6, 2, -4)
    And p3 ← point(2, -1, -1)
    And shape ← triangle(p1, p2, p3)
    When box ← bounds_of(shape)
    Then box.min = point(-3, -1, -4)
    And box.max = point(6, 7, 2)