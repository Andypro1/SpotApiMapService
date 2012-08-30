//  Requires jQuery and knockoutJs

$(document).ready(function() {
	function Point(data) {
		this.latitude  = ko.observable(data.latitude);
		this.longitude = ko.observable(data.longitude);
		this.dateTime  = ko.observable(data.dateTime);
	}

	function PointListViewModel() {
		//  Data
		var self          = this;
		self.points       = ko.observableArray([]);
		self.newLatitude  = ko.observable();
		self.newLongitude = ko.observable();
		self.newDateTime  = ko.observable();

		self.newPointsCount = ko.computed(function() {
			return ko.utils.arrayFilter(self.points(), function(point) { return !point._destroy; });
		});

		//  Operations
		self.addPoint = function() {
			self.points.push(new Point({
				latitude : this.newLatitude(),
				longitude: this.newLongitude(),
				dateTime : this.newDateTime()
			}));
		};

		self.removePoint = function(point) { self.points.destroy(point); };

		self.save = function() {
			$.ajax("/map/edit", {
				data   : ko.toJSON({ points: self.points }),
				type   : "post", contentType: "application/json",
				success: function(result) { alert(result); }
			});
		};

		//  Load initial state from server, convert it to Point instances, then populate self.points
		$.getJSON("/map/json", function(data, textStatus, jqXHR) {
			var mappedPoints = $.map(data.response.feedMessageResponse.messages.message, function(item) {
				return new Point(item);
			});

			self.points(mappedPoints);

			$('body').fadeIn('fast');
		});
	}

	//  One call - that's all!
	ko.applyBindings(new PointListViewModel());
});