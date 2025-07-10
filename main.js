fehVerticalCarousel({ 
    itemsToShow: 6,
    responsive: [
        {
            breakpoint: 900, // viewport height > 900px
            settings: {
                itemsToShow: 6,
            }
        },
        {
            breakpoint: 500, // viewport height > 1200px
            settings: {
                itemsToShow: 4,
            }
        },
        {
            breakpoint: 0, // viewport height < 500px
            settings: {
                itemsToShow: 2,
                speed: .5
            }
        }
    ]
});