using Random, Dates

function monte_carlo_pi(n)
    count = 0
    for _ in 1:n
        x = rand()
        y = rand()
        count += (x*x + y*y <= 1)
    end
    return 4 * count / n
end

println("Running Julia π test (single-thread)...")

n = 50_000_000
start = now()
pi_est = monte_carlo_pi(n)
elapsed = now() - start

println("Estimated π: ", pi_est)
println("Time: ", elapsed)
