angular.module('TodoApp')
    .controller('PopUpCtrl', PopUpCtrl);

PopUpCtrl.$inject = ['$uibModalInstance', 'viewedData', 'header'];
function PopUpCtrl(modalInstance, viewedData, header) {

    var $popup = this;
    $popup.viewedData = viewedData;
    $popup.header = header;

    $popup.ok = function () {
        modalInstance.close($popup.viewedData);
    }
}