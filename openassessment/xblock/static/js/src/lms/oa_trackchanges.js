(function (window) {
    'use strict';
    var OpenAssessment = window.OpenAssessment || {};
    function bindSelectChange(view, peerEditSelect) {
        peerEditSelect.change(function () {
            var $ = window.jQuery;
            var valueSelected = $(':selected', this).val();

            $('.submission__answer__display__title span', view.element).hide();
            $('.submission__answer__display__title', view.element).children('.' + valueSelected).show();

            if (valueSelected === 'yours') {
                $('.submission__answer__display__content__edited', view.element).hide();
                $('#submission__answer__display__content__original', view.element).show();
            } else {
                $('#submission__answer__display__content__original', view.element).hide();
                $('.submission__answer__display__content__edited', view.element).hide();
                $('#submission__answer__display__content__edited__' + valueSelected, view.element).show();
            }
        });
    }

    /**
    Interface for Track Changes assessment view.

    Args:
        element (DOM element): The DOM element representing the XBlock.
        server (OpenAssessment.Server): The interface to the XBlock server.
        baseView (OpenAssessment.BaseView): Container view.

    Returns:
        OpenAssessment.TrackChangesView
    **/
    OpenAssessment.TrackChangesView = function (element, server, baseView) {
        this.element = element;
        this.server = server;
        this.baseView = baseView;
        this.content = null;
        this.initialSubmission = '';
    };

    OpenAssessment.TrackChangesView.prototype.enableTrackChanges = function enableTrackChanges() {
        var document = window.document;
        var $ = window.jQuery;
        var ice = window.ice;
        var editor;
        var element = document.getElementById('track-changes-content');
        if (!element) {
            return;
        }
        this.initialSubmission = $(element).html();
        editor = new ice.InlineChangeEditor({
            element: element,
            handleEvents: true,
            currentUser: {
                id: 1,
                name: 'Reviewer'
            },
            plugins: [
                {
                    // Track content that is cut and pasted
                    name: 'IceCopyPastePlugin',
                    settings: {
                        // List of tags and attributes to preserve when cleaning a paste
                        preserve: 'p,a[href],span[id,class]em,strong'
                    }
                }
            ]
        });
        editor.startTracking();
    };

    OpenAssessment.TrackChangesView.prototype.getEditedContent = function getEditedContent() {
        var $ = window.jQuery;
        var changeTracking = $('#openassessment__peer-assessment');
        var content = $('#track-changes-content', changeTracking).html();
        if (content === this.initialSubmission) {
            content = '';
        }
        return content;
    };

    OpenAssessment.TrackChangesView.prototype.displayTrackChanges = function displayTrackChanges() {
        var $ = window.jQuery;
        var changeTracking = $('.submission__answer__display__content__edited', this.element);
        var gradingTitleHeader = changeTracking.siblings('.submission__answer__display__title');
        var peerEditSelect;
        gradingTitleHeader.wrapInner('<span class="yours"></span>');
        peerEditSelect = $('<select class="submission__answer__display__content__peeredit__select"><option value="yours">Your Response</option></select>')
            .insertBefore(gradingTitleHeader);

        $(changeTracking).each(function () {
            var peerNumber = $(this).data('peer-num');
            $('<span class="peer' + peerNumber + '">Peer ' + peerNumber + '\'s Edits</span>').appendTo(gradingTitleHeader).hide();
            $('<option value="peer' + peerNumber + '">Peer ' + peerNumber + '\'s Edits</option>').appendTo(peerEditSelect);
        });

        bindSelectChange(this, peerEditSelect);
    };
}(window));
