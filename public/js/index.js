$(document).ready(function () {
    console.log(chaincode);
    if (chaincode === undefined || chaincode === null) {
        let info = $('#error-channel-div');
        info.html('');
        info.append('Chaincode ID is missing!');
        info.show();
        return;
    }

    hideSearchError();
    getChannelInfo();
    $('#select-block-number').on('change', function () {
        getBlockInfo(this.value);
    });

    let selectedType = $('#select-search-type option:selected').val();
    searchTypeChanged(selectedType);
    $('#select-search-type').on('change', function () {
        searchTypeChanged(this.value);
    });
});


function getChannelInfo() {
    hideChannelError();

    $.get(`/api/v1/insight/org/org1/channel/${channelID}`,
        {},
        function (result) {
            showLatestBlocks(result.count);
            var info = $('#info');
            info.html("");
            info.append(`<tr>
                    <th>Block count</th>
                    <td>${result.count}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Current Block Hash</th>
                    <td>${result.currentBlockHash}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Previous Block Hash</th>
                    <td>${result.previousBlockHash}</td>
                    </tr>`);

            var select = $('#select-block-number');
            select.html("");
            select.append(`<option disabled selected value> -- select a number -- </option>`);
            var i;
            for (i = 0; i < result.count; i++) {
                select.append(`<option value='${i}'>${i + 1}</option>`);
            }
        })
        .fail(function (e) {
            showChannelError(e);
        })
}

function showLatestBlocks(count) {
    $('#block-info-container').show();
    var tb = $('#block-info');
    tb.html("");
    for (i = 0; i < 20; i += 2) {
        let index_1 = count - i;
        let index_2 = count - i - 1;
        let html = `<div class="row show-grid">
        <div class='col-sm-4 col-sm-offset-1 grid-item text-center'>
            <span>Block #${index_1}</span>
            <a href='/block/${index_1}' target="_blank" type='button' class='btn btn-primary' style='margin-left: 20px'>View detail</a>
        </div>
        <div class='col-sm-4 col-sm-offset-1 grid-item text-center'>
            <span>Block #${index_2}</span>
            <a href='/block/${index_2}' target="_blank" type='button' class='btn btn-primary' style='margin-left: 20px'>View detail</a>
        </div>
        </div>`;
        tb.append(html);
    }
}