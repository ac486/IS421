/**
 * Created by Urvesh on 10/2/2015.
 */

$(document).ready(function() {
    $('#adminTable tbody tr').click(function(event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });

    $('#adminTable #selectAll').click(function(event) {
        if(this.checked) {
            $(':checkbox').each(function() {
                this.checked = true;
            })
        } else {
            $(':checkbox').each(function() {
                this.checked = false;
            })
        }
    });
});