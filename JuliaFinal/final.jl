using CSV, DataFrames, Statistics, Plots
gr()  # Plot backend

start = time()
println("Loading data...")

df = CSV.read("vgsales.csv", DataFrame)

#
# ===== CONVERT + CLEAN DATA BEFORE ANYTHING ELSE =====
#

# Convert Year_of_Release - use missing instead of nothing
df.Year_of_Release = map(df.Year_of_Release) do y
    if y isa Int
        y
    elseif y isa AbstractString
        parsed = tryparse(Int, y)
        parsed === nothing ? missing : parsed
    else
        missing
    end
end

# Convert sales float columns - use missing instead of nothing
sales_cols = [:NA_Sales, :EU_Sales, :JP_Sales, :Other_Sales, :Global_Sales]
for col in sales_cols
    df[!, col] = map(df[!, col]) do x
        if x isa Real
            Float64(x)
        elseif x isa AbstractString
            parsed = tryparse(Float64, x)
            parsed === nothing ? missing : parsed
        else
            missing
        end
    end
end

# Drop rows where year OR sales are missing
df = dropmissing(df, [:Year_of_Release, :Global_Sales])

#
# ===== SUMMARY AFTER CLEANING =====
#

println("\nDataset Summary:")
println("Total Rows: ", nrow(df))
println("Year Range: ", minimum(df.Year_of_Release), " - ", maximum(df.Year_of_Release))

top_platform = sort(combine(groupby(df, :Platform),
                            :Global_Sales => sum => :TotalSales),
                    :TotalSales, rev=true)[1, :]
println("Top Platform: ", top_platform.Platform)

top_genre = sort(combine(groupby(df, :Genre),
                         :Global_Sales => sum => :TotalSales),
                 :TotalSales, rev=true)[1, :]
println("Top Genre: ", top_genre.Genre)

#
# ===== GRAPH 1: Sales Trend Over Time =====
#

year_sales = combine(groupby(df, :Year_of_Release),
                     :Global_Sales => sum => :YearSales)
year_sales = sort(year_sales, :Year_of_Release)  # Sort by year for better line plot

plot(year_sales.Year_of_Release, year_sales.YearSales,
     seriestype=:line,
     xlabel="Year",
     ylabel="Global Sales (Millions)",
     title="Global Video Game Sales Over Time",
     lw=3, color=:blue, legend=false)
savefig("plot_global_sales_trend.png")

#
# ===== GRAPH 2: Top Genres =====
#

genre_sales = combine(groupby(df, :Genre),
                      :Global_Sales => sum => :GenreSales)
genre_sales = sort(genre_sales, :GenreSales, rev=true)[1:10, :]

bar(genre_sales.Genre, genre_sales.GenreSales,
    xlabel="Genre",
    ylabel="Sales (Millions)",
    title="Top 10 Genres by Global Sales",
    legend=false,
    xrotation=45)
savefig("plot_top_genres.png")

#
# ===== GRAPH 3: Score vs Sales =====
#

if :Critic_Score in propertynames(df)
    df_scores = dropmissing(df, [:Critic_Score, :Global_Sales])
    if nrow(df_scores) > 0
        scatter(df_scores.Critic_Score, df_scores.Global_Sales,
                xlabel="Critic Score",
                ylabel="Global Sales (Millions)",
                alpha=0.4,
                title="Critic Score vs Sales",
                legend=false,
                markersize=3)
        savefig("plot_score_vs_sales.png")
    end
end

#
# ===== DONE =====
#

elapsed = round(time() - start, digits=3)
println("\nSaved Plots:")
println(" ✓ plot_global_sales_trend.png")
println(" ✓ plot_top_genres.png")
if :Critic_Score in propertynames(df)
    println(" ✓ plot_score_vs_sales.png")
end
println("\nCompleted in $(elapsed) seconds 🚀")
println("Analysis complete!")