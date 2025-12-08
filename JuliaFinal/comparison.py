import random, time

def monte_carlo_pi(n):
    count = 0
    for _ in range(n):
        x = random.random()
        y = random.random()
        if x*x + y*y <= 1:
            count += 1
    return 4 * count / n

print("Running Python π test (single-thread)...")

n = 50_000_000
start = time.time()
pi_est = monte_carlo_pi(n)
elapsed = time.time() - start

print("Estimated π:", pi_est)
print("Time:", elapsed)
