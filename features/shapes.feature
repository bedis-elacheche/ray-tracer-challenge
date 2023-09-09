Feature: Abstract Shapes

  Scenario: The default transformation
    Given s ← test_shape()
    Then s.transform = identity_matrix

  Scenario: Assigning a transformation
    Given s ← test_shape()
    When set_transform(s, translation(2, 3, 4))
    Then s.transform = translation(2, 3, 4)

  Scenario: The default material
    Given s ← test_shape()
    When m ← s.material
    Then m = material()

  Scenario: Assigning a material
    Given s ← test_shape()
    And m ← material()
    And m.ambient ← 1
    When s.material ← m
    Then s.material = m

  Scenario: Computing the normal on a translated shape
    Given s ← test_shape()
    When set_transform(s, translation(0, 1, 0))
    And n ← normal_at(s, point(0, 1.70711, -0.7071067811865476))
    Then n = vector(0, 0.7071067811865476, -0.7071067811865476)

  Scenario: Computing the normal on a transformed shape
    Given s ← test_shape()
    And m ← scaling(1, 0.5, 1) * rotation_z(π / 5)
    When set_transform(s, m)
    #                    point(0, √2/2              , -√2/2))
    And n ← normal_at(s, point(0, 0.7071067811865476, -0.7071067811865476))
    Then n = vector(0, 0.97014, -0.24254)

  Scenario: A shape has a parent attribute
    Given s ← test_shape()
    Then s.parent is nothing

  Scenario: Converting a point from world to object space
    Given g1 ← group()
    And set_transform(g1, rotation_y(π / 2))
    And g2 ← group()
    And set_transform(g2, scaling(2, 2, 2))
    And add_child(g1, g2)
    And s ← sphere()
    And set_transform(s, translation(5, 0, 0))
    And add_child(g2, s)
    When p ← world_to_object(s, point(-2, 0, -10))
    Then p = point(0, 0, -1)

  Scenario: Converting a normal from object to world space
    Given g1 ← group()
    And set_transform(g1, rotation_y(π / 2))
    And g2 ← group()
    And set_transform(g2, scaling(1, 2, 3))
    And add_child(g1, g2)
    And s ← sphere()
    And set_transform(s, translation(5, 0, 0))
    And add_child(g2, s)
    #                           vector(√3/3              , √3/3              , √3/3)
    When n ← normal_to_world(s, vector(0.5773502691896257, 0.5773502691896257, 0.5773502691896257))
    Then n = vector(0.2857, 0.4286, -0.8571)

  Scenario: Finding the normal on a child object
    Given g1 ← group()
    And set_transform(g1, rotation_y(π / 2))
    And g2 ← group()
    And set_transform(g2, scaling(1, 2, 3))
    And add_child(g1, g2)
    And s ← sphere()
    And set_transform(s, translation(5, 0, 0))
    And add_child(g2, s)
    When n ← normal_at(s, point(1.7321, 1.1547, -5.5774))
    Then n = vector(0.2857, 0.4286, -0.8571)

  Scenario: Test shape has (arbitrary) bounds
    Given shape ← test_shape()
    When box ← bounds_of(shape)
    Then box.min = point(-1, -1, -1)
    And box.max = point(1, 1, 1)

  Scenario: Querying a shape's bounding box in its parent's space
    Given shape ← sphere()
    And set_transform(shape, translation(1, -3, 5) * scaling(0.5, 2, 4))
    When box ← parent_space_bounds_of(shape)
    Then box.min = point(0.5, -5, 1)
    And box.max = point(1.5, -1, 9)

  Scenario: Subdividing a primitive does nothing
    Given shape ← sphere()
    When divide(shape, 1)
    Then shape is a sphere