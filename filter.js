/**
 * Generate a checkbox for each type of disaster
 * 
 * @param {DOM element} parent Parent element to populate
 * @param {Function} cb Function called when a checkbox change
 */
function generateFilterNav(parent, cb = undefined) {
    dataDisasterTypes.forEach(sg => {
        let id = sg.id.toString();
        $(parent).append('<label class="disa sg" for="sg' + id + '"><input class="sg" type="checkbox" id="sg' + id + '" name="sg' + id + '" value="' + id + '" checked/>' + sg.name + '</label>');

        sg.types.forEach(t => {
            let idt = id + '-' + t.id.toString();
            $(parent).append('<label class="disa t" for="t' + idt + '"><input class="t" type="checkbox" id="t' + idt + '" name="t' + idt + '" value="' + idt + '" checked/>' + t.name + '</label>');

            t.subtypes.forEach(st => {
                let idst = idt + '-' + st.id.toString();
                $(parent).append('<label class="disa st" for="st' + idst + '"><input class="st" type="checkbox" id="st' + idst + '" name="st' + idst + '" value="' + idst + '" checked/>' + st.name + '</label>');
            });
        });
    });
    $(parent).append('<button class="ml-3 mr-3 mt-2 btn btn-outline-secondary" id="reset-filters">Reset filters</button>');
    $(parent).find('#reset-filters').click(function () {
        $(parent).find('label.disa input').prop('disabled', false).prop('checked', true);
        cb();
    });

    $(parent).find('label.disa input').change(function () {
        updateGroupEnabling(parent, this);
        if (cb != undefined) {
            cb();
        }
    });
}

/**
 * Update the enability of children filters
 * 
 * @param {DOM element} container Element containing the checkboxes
 * @param {DOM element} changedElement Changed checkbox
 */
function updateGroupEnabling(container, changedElement) {
    let en = $(changedElement).prop('checked');
    let id = $(changedElement).val();

    let rec = [];
    $(container).find('label.disa input').each(function () {
        let v = $(this).val();
        if (v != id && v.startsWith(id)) {
            $(this).prop('disabled', !en);
            if (en && $(this).hasClass('t')) {
                rec.push(this);
            }
        }
    });

    rec.forEach(el => {
        if (!$(el).prop('checked')) {
            updateGroupEnabling(container, el);
        }
    });
}

/**
 * Generate the array of ids used to filter disasters using the checked checkboxes
 * 
 * @param {DOM element} container Element containing all checkboxes
 */
function createFilterArray(container) {
    let ids = [];
    $(container).find('label.disa input:checked:enabled').each(function() {
        ids.push($(this).val());
    });
    return ids;
}