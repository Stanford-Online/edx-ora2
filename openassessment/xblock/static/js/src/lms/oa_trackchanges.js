(function(window) {
    'use strict';
    /**
    Interface for TrackChanges assessment view.

    Args:
        element (DOM element): The DOM element representing the XBlock.
        server (OpenAssessment.Server): The interface to the XBlock server.
        baseView (OpenAssessment.BaseView): Container view.

    Returns:
        OpenAssessment.TrackChangesView
    **/
    var OpenAssessment = window.OpenAssessment || {};
    function TrackChangesView(element, server, baseView) {
        this.element = element;
        this.server = server;
        this.baseView = baseView;
        this.content = null;
    }

    function clearChangesHandler(e) {
        var suffix = this.id.split('_').pop();
        if (window.confirm(gettext('Are you sure you want to clear your changes?'))) {
            e.data.trackers[suffix].rejectAll();
        }
    }

    TrackChangesView.prototype.enableTrackChanges = function enableTrackChanges() {
        var tracker;
        var $ = window.jQuery;
        var ice = window.ice;
        var trackChangesElement;
        var trackChangesSelector = $('[id^=track-changes-content_]', this.element);
        var trackers = [];

        if (trackChangesSelector.length == 0) {
            return;
        }
        for (var index = 0; index < trackChangesSelector.length; index++) {
            trackChangesElement = trackChangesSelector.get(index);

            tracker = new ice.InlineChangeEditor({
                element: trackChangesElement,
                handleEvents: true,
                currentUser: {id: 1, name: 'Reviewer'},
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
            tracker.startTracking();
            trackers.push(tracker);

            $('#track_changes_clear_button_' + index, this.element).click({trackers: trackers}, clearChangesHandler);
        }
    };

    TrackChangesView.prototype.getEditedContent = function getEditedContent() {
        var $ = window.jQuery;
        var editedContents = [];
        var trackChangesContent = $('[id^=track-changes-content_]', this.element);
        if (trackChangesContent.size() > 0) {
            for (var index = 0; index < trackChangesContent.length; index++) {
                var editedContentHtml = trackChangesContent.get(index).innerHTML;

                editedContents.push(editedContentHtml);
            }
        }
        return editedContents;
    };

    TrackChangesView.prototype.displayTrackChanges = function displayTrackChanges() {
        var view = this;
        var $ = window.jQuery;
        var numPeerEdits = $('.submission__answer__part__text__value.edited').filter(':last').data('peer-num');
        var gradeContent = $('[id^=openassessment__grade__] .submission__answer__display__content', view.element);
        var peerEditSelect = $('<select><option value="original">' + gettext('Your Unedited Submission') + '</option></select>')
            .insertBefore(gradeContent)
            .wrap("<div class='submission__answer__display__content__peeredit__select'>");
        $('<span>' + gettext('Showing response with:') + ' </span>').insertBefore(peerEditSelect);
        for (var peerNumber = 1; peerNumber <= numPeerEdits; peerNumber++) {
            $('<option value="peer' + peerNumber + '">Peer ' + peerNumber + "'s Edits</option>")
                .appendTo(peerEditSelect);
        }
        var responseHeaders = $('[id^=openassessment__grade__] .submission__answer__response__title');
        var originalAnswerLabel = responseHeaders.first().text();
        $(peerEditSelect).change(function() {
            var valueSelected = $(':selected', this).val();
            if (valueSelected === 'original') {
                responseHeaders.html(originalAnswerLabel);
                $('.submission__answer__part__text__value.edited', view.element).hide();
                $('.submission__answer__part__text__value.original', view.element).show();
            } else {
                responseHeaders.html($(':selected', this).text());
                $('.submission__answer__part__text__value.original', view.element).hide();
                $('.submission__answer__part__text__value.edited', view.element).hide();
                $('.submission__answer__part__text__value.edited.' + valueSelected, view.element).show();
            }
        });
    };

    OpenAssessment.TrackChangesView = TrackChangesView;
    window.OpenAssessment = OpenAssessment;
}(window));
