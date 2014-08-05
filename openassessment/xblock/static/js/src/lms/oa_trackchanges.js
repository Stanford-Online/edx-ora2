/**
Interface for trackchanges assessment view.

Args:
    element (DOM element): The DOM element representing the XBlock.
    server (OpenAssessment.Server): The interface to the XBlock server.
    baseView (OpenAssessment.BaseView): Container view.

Returns:
    OpenAssessment.TrackchangesView
**/
OpenAssessment.TrackchangesView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView;
    this.content = null;
    this.initialSubmission = "";
};


OpenAssessment.TrackchangesView.prototype = {

    /**
    Enable Track Changes
    **/
    enableTrackchanges: function() {
        var view = this;

        if (jQuery.isEmptyObject($('#track-changes-content'))) {
            return;
        }
        this.initialSubmission = $('#track-changes-content').html();
        var tracker = new ice.InlineChangeEditor({
            element: document.getElementById('track-changes-content'),
            handleEvents: true,
            currentUser: { id: 1, name: 'Reviewer' },
            // optional plugins
            plugins: [
                // Track content that is cut and pasted
                {
                    name: 'IceCopyPastePlugin',
                    settings: {
                        // List of tags and attributes to preserve when cleaning a paste
                        preserve: 'p,a[href],span[id,class]em,strong'
                    }
                }
            ]
        }).startTracking();
    },

    editedContent: function() {
        var view = this;
        var changeTracking = $('#openassessment__peer-assessment');

        var edited_content = $('#track-changes-content', changeTracking).html();
        if (edited_content === view.initialSubmission) {
            edited_content = '';
        }
        return edited_content;
    },

    displayTrackchanges: function() {
        var view = this;
        var baseView = this.baseView;
        var changeTracking = $('.submission__answer__display__content__edited', view.element);
        var gradingTitleHeader = changeTracking.siblings('.submission__answer__display__title');
        gradingTitleHeader.wrapInner('<span class="yours"></span>');
        var peereditSelect = $("<select class='submission__answer__display__content__peeredit__select'><option value='yours'>Your Response</option></select>").insertBefore(gradingTitleHeader);

        $(changeTracking).each(function(index) {
            var peerNum = $(this).data('peer-num');

            $("<span class='peer"+peerNum+"'>Peer "+peerNum+"'s Edits</span>").appendTo(gradingTitleHeader).hide();
            $("<option value='peer"+peerNum+"'>Peer "+peerNum+"'s Edits</option>").appendTo(peereditSelect);
        });

        view.bind_select_change(peereditSelect);
    },

    bind_select_change: function(peereditSelect) {
        var view = this;
        var baseView = this.baseView;

        $(peereditSelect).change(function() {
            valueSelected = $(':selected', this).val();

            $('.submission__answer__display__title span', view.element).hide();
            $('.submission__answer__display__title', view.element).children('.'+valueSelected).show();

            if (valueSelected == 'yours') {
                $('.submission__answer__display__content__edited', view.element).hide();
                $('#submission__answer__display__content__original', view.element).show();
            } else {
                $('#submission__answer__display__content__original', view.element).hide();
                $('.submission__answer__display__content__edited', view.element).hide();
                $('#submission__answer__display__content__edited__'+valueSelected, view.element).show();
            }
        });
    }
};
