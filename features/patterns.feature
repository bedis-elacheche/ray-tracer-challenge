Feature: Patterns

  Background:
    Given black ← color(0, 0, 0)
    And white ← color(1, 1, 1)

  Scenario: Creating a stripe pattern
    Given pattern ← stripe_pattern(white, black)
    Then pattern.a = white
    And pattern.b = black

  Scenario: A stripe pattern is constant in y
    Given pattern ← stripe_pattern(white, black)
    Then stripe_at(pattern, point(0, 0, 0)) = white
    And stripe_at(pattern, point(0, 1, 0)) = white
    And stripe_at(pattern, point(0, 2, 0)) = white

  Scenario: A stripe pattern is constant in z
    Given pattern ← stripe_pattern(white, black)
    Then stripe_at(pattern, point(0, 0, 0)) = white
    And stripe_at(pattern, point(0, 0, 1)) = white
    And stripe_at(pattern, point(0, 0, 2)) = white

  Scenario: A stripe pattern alternates in x
    Given pattern ← stripe_pattern(white, black)
    Then stripe_at(pattern, point(0, 0, 0)) = white
    And stripe_at(pattern, point(0.9, 0, 0)) = white
    And stripe_at(pattern, point(1, 0, 0)) = black
    And stripe_at(pattern, point(-0.1, 0, 0)) = black
    And stripe_at(pattern, point(-1, 0, 0)) = black
    And stripe_at(pattern, point(-1.1, 0, 0)) = white

  Scenario: Stripes with an object transformation
    Given object ← sphere()
    And set_transform(object, scaling(2, 2, 2))
    And pattern ← stripe_pattern(white, black)
    When c ← stripe_at_object(pattern, object, point(1.5, 0, 0))
    Then c = white

  Scenario: Stripes with a pattern transformation
    Given object ← sphere()
    And pattern ← stripe_pattern(white, black)
    And set_pattern_transform(pattern, scaling(2, 2, 2))
    When c ← stripe_at_object(pattern, object, point(1.5, 0, 0))
    Then c = white

  Scenario: Stripes with both an object and a pattern transformation
    Given object ← sphere()
    And set_transform(object, scaling(2, 2, 2))
    And pattern ← stripe_pattern(white, black)
    And set_pattern_transform(pattern, translation(0.5, 0, 0))
    When c ← stripe_at_object(pattern, object, point(2.5, 0, 0))
    Then c = white

  Scenario: The default pattern transformation
    Given pattern ← test_pattern()
    Then pattern.transform = identity_matrix

  Scenario: Assigning a transformation
    Given pattern ← test_pattern()
    When set_pattern_transform(pattern, translation(1, 2, 3))
    Then pattern.transform = translation(1, 2, 3)

  Scenario: A pattern with an object transformation
    Given shape ← sphere()
    And set_transform(shape, scaling(2, 2, 2))
    And pattern ← test_pattern()
    When c ← pattern_at_shape(pattern, shape, point(2, 3, 4))
    Then c = color(1, 1.5, 2)

  Scenario: A pattern with a pattern transformation
    Given shape ← sphere()
    And pattern ← test_pattern()
    And set_pattern_transform(pattern, scaling(2, 2, 2))
    When c ← pattern_at_shape(pattern, shape, point(2, 3, 4))
    Then c = color(1, 1.5, 2)

  Scenario: A pattern with both an object and a pattern transformation
    Given shape ← sphere()
    And set_transform(shape, scaling(2, 2, 2))
    And pattern ← test_pattern()
    And set_pattern_transform(pattern, translation(0.5, 1, 1.5))
    When c ← pattern_at_shape(pattern, shape, point(2.5, 3, 3.5))
    Then c = color(0.75, 0.5, 0.25)

  Scenario: A gradient linearly interpolates between colors
    Given pattern ← gradient_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0.25, 0, 0)) = color(0.75, 0.75, 0.75)
    And pattern_at(pattern, point(0.5, 0, 0)) = color(0.5, 0.5, 0.5)
    And pattern_at(pattern, point(0.75, 0, 0)) = color(0.25, 0.25, 0.25)

  Scenario: A ring should extend in both x and z
    Given pattern ← ring_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(1, 0, 0)) = black
    And pattern_at(pattern, point(0, 0, 1)) = black
    # 0.708 = just slightly more than √2/2
    And pattern_at(pattern, point(0.708, 0, 0.708)) = black

  Scenario: Checkers should repeat in x
    Given pattern ← checkers_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0.99, 0, 0)) = white
    And pattern_at(pattern, point(1.01, 0, 0)) = black

  Scenario: Checkers should repeat in y
    Given pattern ← checkers_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0, 0.99, 0)) = white
    And pattern_at(pattern, point(0, 1.01, 0)) = black

  Scenario: Checkers should repeat in z
    Given pattern ← checkers_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0, 0, 0.99)) = white
    And pattern_at(pattern, point(0, 0, 1.01)) = black

  Scenario Outline: Checker pattern in 2D
    Given checkers ← uv_checkers(2, 2, black, white)
    When color ← uv_pattern_at(checkers, <u>, <v>)
    Then color = <expected>

    Examples:
      | u   | v   | expected |
      | 0.0 | 0.0 | black    |
      | 0.5 | 0.0 | white    |
      | 0.0 | 0.5 | white    |
      | 0.5 | 0.5 | black    |
      | 1.0 | 1.0 | black    |

  Scenario Outline: Using a spherical mapping on a 3D point
    Given p ← <point>
    When (u, v) ← spherical_map(p)
    Then u = <u>
    And v = <v>

    Examples:
      | point                                            | u    | v    |
      | point(0, 0, -1)                                  | 0.0  | 0.5  |
      | point(1, 0, 0)                                   | 0.25 | 0.5  |
      | point(0, 0, 1)                                   | 0.5  | 0.5  |
      | point(-1, 0, 0)                                  | 0.75 | 0.5  |
      | point(0, 1, 0)                                   | 0.5  | 1.0  |
      | point(0, -1, 0)                                  | 0.5  | 0.0  |
      # point(√2/2              , √2/2              , 0) | 0.25 | 0.75 |
      | point(0.7071067811865476, 0.7071067811865476, 0) | 0.25 | 0.75 |

  Scenario Outline: Using a texture map pattern with a spherical map
    Given checkers ← uv_checkers(16, 8, black, white)
    And pattern ← texture_map(checkers, spherical_map)
    Then pattern_at(pattern, <point>) = <color>

    Examples:
      | point                            | color |
      | point(0.4315, 0.4670, 0.7719)    | white |
      | point(-0.9654, 0.2552, -0.0534)  | black |
      | point(0.1039, 0.7090, 0.6975)    | white |
      | point(-0.4986, -0.7856, -0.3663) | black |
      | point(-0.0317, -0.9395, 0.3411)  | black |
      | point(0.4809, -0.7721, 0.4154)   | black |
      | point(0.0285, -0.9612, -0.2745)  | black |
      | point(-0.5734, -0.2162, -0.7903) | white |
      | point(0.7688, -0.1470, 0.6223)   | black |
      | point(-0.7652, 0.2175, 0.6060)   | black |

  Scenario Outline: Using a planar mapping on a 3D point
    Given p ← <point>
    When (u, v) ← planar_map(p)
    Then u = <u>
    And v = <v>

    Examples:
      | point                   | u    | v    |
      | point(0.25, 0, 0.5)     | 0.25 | 0.5  |
      | point(0.25, 0, -0.25)   | 0.25 | 0.75 |
      | point(0.25, 0.5, -0.25) | 0.25 | 0.75 |
      | point(1.25, 0, 0.5)     | 0.25 | 0.5  |
      | point(0.25, 0, -1.75)   | 0.25 | 0.25 |
      | point(1, 0, -1)         | 0.0  | 0.0  |
      | point(0, 0, 0)          | 0.0  | 0.0  |

  Scenario Outline: Using a cylindrical mapping on a 3D point
    Given p ← <point>
    When (u, v) ← cylindrical_map(p)
    Then u = <u>
    And v = <v>

    Examples:
      | point                          | u     | v    |
      | point(0, 0, -1)                | 0.0   | 0.0  |
      | point(0, 0.5, -1)              | 0.0   | 0.5  |
      | point(0, 1, -1)                | 0.0   | 0.0  |
      | point(0.70711, 0.5, -0.70711)  | 0.125 | 0.5  |
      | point(1, 0.5, 0)               | 0.25  | 0.5  |
      | point(0.70711, 0.5, 0.70711)   | 0.375 | 0.5  |
      | point(0, -0.25, 1)             | 0.5   | 0.75 |
      | point(-0.70711, 0.5, 0.70711)  | 0.625 | 0.5  |
      | point(-1, 1.25, 0)             | 0.75  | 0.25 |
      | point(-0.70711, 0.5, -0.70711) | 0.875 | 0.5  |

  Scenario Outline: Layout of the "align check" pattern
    Given main ← color(1, 1, 1)
    And ul ← color(1, 0, 0)
    And ur ← color(1, 1, 0)
    And bl ← color(0, 1, 0)
    And br ← color(0, 1, 1)
    And pattern ← uv_align_check(main, ul, ur, bl, br)
    When c ← uv_pattern_at(pattern, <u>, <v>)
    Then c = <expected>

    Examples:
      | u   | v   | expected |
      | 0.5 | 0.5 | main     |
      | 0.1 | 0.9 | ul       |
      | 0.9 | 0.9 | ur       |
      | 0.1 | 0.1 | bl       |
      | 0.9 | 0.1 | br       |

  Scenario Outline: Identifying the face of a cube from a point
    When face ← face_from_point(<point>)
    Then face = <face>

    Examples:
      | point                  | face    |
      | point(-1, 0.5, -0.25)  | "left"  |
      | point(1.1, -0.75, 0.8) | "right" |
      | point(0.1, 0.6, 0.9)   | "front" |
      | point(-0.7, 0, -2)     | "back"  |
      | point(0.5, 1, 0.9)     | "up"    |
      | point(-0.2, -1.3, 1.1) | "down"  |

  Scenario Outline: UV mapping the front face of a cube
    When (u, v) ← cube_uv_front(<point>)
    Then u = <u>
    And v = <v>

    Examples:
      | point               | u    | v    |
      | point(-0.5, 0.5, 1) | 0.25 | 0.75 |
      | point(0.5, -0.5, 1) | 0.75 | 0.25 |

  Scenario Outline: UV mapping the back face of a cube
    When (u, v) ← cube_uv_back(<point>)
    Then u = <u>
    And v = <v>

    Examples:
      | point                 | u    | v    |
      | point(0.5, 0.5, -1)   | 0.25 | 0.75 |
      | point(-0.5, -0.5, -1) | 0.75 | 0.25 |

  Scenario Outline: UV mapping the left face of a cube
    When (u, v) ← cube_uv_left(<point>)
    Then u = <u>
    And v = <v>

    Examples:
      | point                | u    | v    |
      | point(-1, 0.5, -0.5) | 0.25 | 0.75 |
      | point(-1, -0.5, 0.5) | 0.75 | 0.25 |

  Scenario Outline: UV mapping the right face of a cube
    When (u, v) ← cube_uv_right(<point>)
    Then u = <u>
    And v = <v>

    Examples:
      | point                | u    | v    |
      | point(1, 0.5, 0.5)   | 0.25 | 0.75 |
      | point(1, -0.5, -0.5) | 0.75 | 0.25 |

  Scenario Outline: UV mapping the upper face of a cube
    When (u, v) ← cube_uv_up(<point>)
    Then u = <u>
    And v = <v>

    Examples:
      | point                | u    | v    |
      | point(-0.5, 1, -0.5) | 0.25 | 0.75 |
      | point(0.5, 1, 0.5)   | 0.75 | 0.25 |

  Scenario Outline: UV mapping the lower face of a cube
    When (u, v) ← cube_uv_down(<point>)
    Then u = <u>
    And v = <v>

    Examples:
      | point                | u    | v    |
      | point(-0.5, -1, 0.5) | 0.25 | 0.75 |
      | point(0.5, -1, -0.5) | 0.75 | 0.25 |


  Scenario Outline: Finding the colors on a mapped cube
    When red ← color(1, 0, 0)
    And yellow ← color(1, 1, 0)
    And brown ← color(1, 0.5, 0)
    And green ← color(0, 1, 0)
    And cyan ← color(0, 1, 1)
    And blue ← color(0, 0, 1)
    And purple ← color(1, 0, 1)
    And white ← color(1, 1, 1)
    And left ← uv_align_check(yellow, cyan, red, blue, brown)
    And front ← uv_align_check(cyan, red, yellow, brown, green)
    And right ← uv_align_check(red, yellow, purple, green, white)
    And back ← uv_align_check(green, purple, cyan, white, blue)
    And up ← uv_align_check(brown, cyan, purple, red, yellow)
    And down ← uv_align_check(purple, brown, green, blue, white)
    And pattern ← cube_map(left, front, right, back, up, down)
    Then pattern_at(pattern, <point>) = <color>

    Examples:
      |   | point                 | color  |
      | L | point(-1, 0, 0)       | yellow |
      |   | point(-1, 0.9, -0.9)  | cyan   |
      |   | point(-1, 0.9, 0.9)   | red    |
      |   | point(-1, -0.9, -0.9) | blue   |
      |   | point(-1, -0.9, 0.9)  | brown  |
      | F | point(0, 0, 1)        | cyan   |
      |   | point(-0.9, 0.9, 1)   | red    |
      |   | point(0.9, 0.9, 1)    | yellow |
      |   | point(-0.9, -0.9, 1)  | brown  |
      |   | point(0.9, -0.9, 1)   | green  |
      | R | point(1, 0, 0)        | red    |
      |   | point(1, 0.9, 0.9)    | yellow |
      |   | point(1, 0.9, -0.9)   | purple |
      |   | point(1, -0.9, 0.9)   | green  |
      |   | point(1, -0.9, -0.9)  | white  |
      | B | point(0, 0, -1)       | green  |
      |   | point(0.9, 0.9, -1)   | purple |
      |   | point(-0.9, 0.9, -1)  | cyan   |
      |   | point(0.9, -0.9, -1)  | white  |
      |   | point(-0.9, -0.9, -1) | blue   |
      | U | point(0, 1, 0)        | brown  |
      |   | point(-0.9, 1, -0.9)  | cyan   |
      |   | point(0.9, 1, -0.9)   | purple |
      |   | point(-0.9, 1, 0.9)   | red    |
      |   | point(0.9, 1, 0.9)    | yellow |
      | D | point(0, -1, 0)       | purple |
      |   | point(-0.9, -1, 0.9)  | brown  |
      |   | point(0.9, -1, 0.9)   | green  |
      |   | point(-0.9, -1, -0.9) | blue   |
      |   | point(0.9, -1, -0.9)  | white  |