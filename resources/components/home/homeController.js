angular.module("movies").controller("HomeController", ['HomeService', '$q', '$timeout', '$scope', HomeController]);

function HomeController(HomeService, $q, $timeout, $scope) {
	var homeVm = this;
	homeVm.moviesList = [];
    homeVm.pageSize = 20;
    homeVm.startFrom = 1;
    homeVm.totalPages = null;
    homeVm.currentPage = 1;
    homeVm.languages = [];
    homeVm.countries = [];
    
    /* Calling API of HomeService to get movie list */
	HomeService.getMoviesList()
				.then(function(data){
                    homeVm.moviesList = data;
                    var i, movieId, len = homeVm.moviesList.length;
                    var langSet = new Set();
                    var ctrySet = new Set();
                    for(i = 0; i < len; ++i) {
                        homeVm.moviesList[i].genresList = homeVm.moviesList[i].genres.split('|');
                        if(homeVm.moviesList[i].language !== "") {
                            langSet.add(homeVm.moviesList[i].language);
                        } else{
                            homeVm.moviesList[i].language = "NA";
                        }
                        if(homeVm.moviesList[i].country !== "") {
                            ctrySet.add(homeVm.moviesList[i].country);
                        } else {
                            homeVm.moviesList[i].country = "NA";
                        }
                        if(homeVm.moviesList[i].title_year === "") {
                            homeVm.moviesList[i].title_year = "NA";
                        }
                    }
                    homeVm.languages = Array.from(langSet);
                    
                    homeVm.countries = Array.from(ctrySet);
                    
                    homeVm.setTotalPages(len);
                    homeVm.getPosters(homeVm.moviesList, 0);
                    //console.log(homeVm.filteredList);
				}, function(response){
                    console.log("Location=HomeController, msg=Some error occurred while fetching movie data");
                    console.log(response);
                }).catch(function(){
                    console.log("Some exception occurred in success method");
                });
    
    /* Calling API of HomeService to get movie posters */
    homeVm.getPosters = function(list, start) {
        var promises=[], i;
        var end;
        if((start + homeVm.pageSize) < list.length){
            end = (start + homeVm.pageSize);
        }else {
            end = list.length;
        }
        
        for(i = start; i < end; ++i) {
            movieId = list[i].movie_imdb_link.split("/")[4];
            if(!list[i].hasOwnProperty("image") && movieId !== "") {
                promises.push(HomeService.getMoviePosters(movieId));   
            }
        }
        
        $q.all(promises).then(function(data) {
            for(i = 0; i < data.length; ++i) {
                if(!list[start+i].hasOwnProperty("image")){
                    list[start+i].image = data[i].Poster;    
                }
                if(!list[start+i].hasOwnProperty("plot"))
                    list[start+i].plot = data[i].Plot;
            }
        });
    }
    
    homeVm.call = function() {
        homeVm.currentPage = 1;
        update();
    }

    function initializeDropdowns() {
        angular.element('#language').dropdown({
            onChange: function(){
                homeVm.lang = angular.element("#language").dropdown("get text");
                homeVm.ctry = "";
                $scope.$apply();
                update();
            }
        });
        angular.element('#country').dropdown({
            onChange: function() {
                homeVm.ctry = angular.element("#country").dropdown("get text");
                homeVm.lang = "";
                $scope.$apply();
                update();
            }
        });
        
        angular.element("#filterByDropdown").dropdown();
        homeVm.disableDropdown = true;
    }

    homeVm.clearFilters = function() {
        // resetting dropdowns(filter option, country & language)
        homeVm.filterBy = "";
        homeVm.ctry = "";
        homeVm.lang = "";
        angular.element("#language").dropdown("set text", "");
        angular.element("#country").dropdown("set text", "");
        angular.element('#filterByDropdown').dropdown("restore placeholder text");
        homeVm.disableDropdown = true;

        // resetting sort by year
        homeVm.prop = "";
        homeVm.rev = false;
        angular.element("#sortYearBtn").html("Latest first");
        homeVm.currentPage = 1;
        update();
    }

    homeVm.openFilters = function() {
        angular.element("#filters").slideToggle();
        initializeDropdowns();
    }

    homeVm.changeFilterType = function() {
        let filter = angular.element('#filterByDropdown').dropdown("get text");
        homeVm.disableDropdown = false;
        if(filter === "Country"){
            homeVm.showCountryDropdown = true;
        }else if(filter === "Language") {
            homeVm.showCountryDropdown = false;
        }else{
            homeVm.disableDropdown = true;
        }
    }
    
    homeVm.setTotalPages = function(len) {
        homeVm.totalPages = Math.ceil(len/homeVm.pageSize);
    }
    
    /* Functions for pagination */
    homeVm.next = function() {
        if(homeVm.currentPage < homeVm.totalPages){
            homeVm.currentPage += 1;
            update();
        }
    }
    homeVm.prev = function(){
        if(homeVm.currentPage > 1){
            homeVm.currentPage -= 1;
            update();
        }
    }
    homeVm.first = function(){
        homeVm.currentPage=1;
        update();
    }
    homeVm.last = function(){
        homeVm.currentPage = homeVm.totalPages;
        update();
    }

    
    /* Filters */
    homeVm.setLanguage = function() {
        homeVm.lang = angular.element("#language").dropdown("get text");
        homeVm.currentPage=1;
        update();
    }
    
    homeVm.setCountry = function() {
        homeVm.ctry = angular.element("#country").dropdown("get text");
        homeVm.currentPage=1;
        update();
    }

    homeVm.rev = false;
    homeVm.sortByYear = function() {
        if(homeVm.rev){
            angular.element("#sortYearBtn").html("Latest first");
        } else {
            angular.element("#sortYearBtn").html("Oldest first");
        }
        homeVm.prop = 'title_year';
        homeVm.rev = !homeVm.rev;
        homeVm.currentPage=1;
        update();
    }

    // Fetches posters of the filteredList array and sets total pages of pagination
    function update() {
        $timeout(function() {
            homeVm.getPosters(homeVm.filteredList, (homeVm.currentPage-1)*homeVm.pageSize); // fetch posters
            homeVm.setTotalPages(homeVm.filteredList.length); // update total pages
        }, 50);
    }
}