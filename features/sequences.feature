Feature: Sequences

    Scenario: A number generator returns a cyclic sequence of numbers
        Given gen ← sequence(0.1, 0.5, 1.0)
        Then next(gen) = 0.1
        And next(gen) = 0.5
        And next(gen) = 1.0
        And next(gen) = 0.1