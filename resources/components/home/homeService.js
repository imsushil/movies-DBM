angular.module("movies").service("HomeService", ["$http", "$q", function($http, $q) {
	this.getMoviesList = function() {
		var deferred = $q.defer();
		var promise = $http.get("resources/assets/movieslisting.json").then(function(response) {
			return response.data;
		}, function(response) {
			deferred.reject("Location=HomeService, msg=Some error occurred while fetching movie details!");
		});
		return promise;
	}
    
    this.getMoviePosters = function(moveId) {
        var promise = $http.get("http://www.omdbapi.com/?i="+moveId+"&apikey=7142c665").then(function(response) {
			return response.data;
		}, function(response) {
			console.log("Some error occurred while fetching movie posters!");
		});
		return promise;
    }
}]);
