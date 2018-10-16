$(document).ready(function () {
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

    if (txid) {
        $('#text-object-search').val(txid);
        getTransaction(txid);
    }
});

function getErrorMessage(error) {
    if (error === null || error === undefined) {
        return 'Could not get reponse!';
    }
    
    const messageRe = /(message:.*\)<)/;
    const headerRe = /(<h1>(.|\n)*?<\/h1>)/;

    if (messageRe.test(error)) {
        let m = error.match(messageRe);
        if (m.length > 0) {
            var temp = m[0].split(")<")[0];
            temp = temp.split("message:")[1];
            return `<strong>${temp}</strong>`;
        }
    } else if (headerRe.test(error)) {
        let m = error.match(headerRe);
        if (m.length > 0) {
            var temp = m[0].split("</h1>")[0];
            temp = temp.split("<h1>")[1];
            return `<strong>${temp}</strong>`;
        }
    }

    return error
}

function showSearchError(e) {
    $('#search-info-container').hide();
    $('#object-info-container').hide();
    let info = $('#error-div');
    info.html('');
    info.append(getErrorMessage(e.responseText));
    info.show();
}

function hideSearchError() {
    $('#error-div').html('');
    $('#error-div').hide();
}

function showChannelError(e) {
    let info = $('#error-channel-div');
    info.html('');
    info.append(getErrorMessage(e.responseText));
    info.show();
}

function hideChannelError() {
    $('#error-channel-div').html('');
    $('#error-channel-div').hide();
}

function showBlockError(e) {
    $('#block-info-container').hide();
    let info = $('#block-error-div');
    info.html('');
    info.append(getErrorMessage(e.responseText));
    info.show();
}

function hideBlockError() {
    $('#block-error-div').html('');
    $('#block-error-div').hide();
}

function createTransactionHTML(transaction, index) {
    var tb = ``;
    if (index > 0) {
        tb = `<tr><th>Transaction ${index}</th><td><div><table class="table table-bordered table-striped" style="margin-bottom:0px;">`;
    }
    tb += `<tr><th>Transaction ID</th><td>${transaction.tx_id}</td></tr>`;
    tb += `<tr><th>Time</th><td>${transaction.time}</td></tr>`;
    tb += `<tr><th>Type</th><td>${transaction.type}</td></tr>`;
    tb += `<tr><th>Channel</th><td>${transaction.channel}</td></tr>`;

    var j = 1;
    for (let action of transaction.actions) {
        var tbAction = `<tr><th>Action ${j++}</th><td><div><table class="table table-bordered table-striped" style="margin-bottom:0px;">`;
        tbAction += `<tr><th>Creator</th><td>${action.creator.name}</td></tr>`;
        tbAction += `<tr><th>Creator Certificate</th><td>${action.creator.cert}</td></tr>`;
        tbAction += `<tr><th>Chaincode Name</th><td>${action.chaincode}</td></tr>`;
        tbAction += `<tr><th>Chaincode Version</th><td>${action.chaincode_version}</td></tr>`;
        tbAction += `<tr><th>Chaincode Input</th><td>${action.chaincode_input}</td></tr>`;
        tbAction += `<tr><th>Endorsers</th><td>${action.endorsers}</td></tr>`;
        tbAction += `<tr><th>Proposal Response Status</th><td>${action.proposal_response.status}</td></tr>`;
        tbAction += `<tr><th>Read-Write Sets</th><td><pre style="max-width:600px">${JSON.stringify(action.proposal_response.rw_set, null, 2)}</pre></td></tr>`;
        tbAction += `</table></div></td></tr>`;
        tb += tbAction;
    }

    if (index > 0) {
        tb += `</table></div></td>`;
    }
    tb += `</tr>`;
    return tb
}

function getBlockInfo(num) {
    hideBlockError();

    $.get(`/api/v1/insight/org/org1/channel/${channelID}/block/${num}`,
        {},
        function (result) {
            let container = $('#block-info-container');
            container.show();

            var info = $('#block-info');
            info.html("");
            info.append(`<tr>
                    <th>Data Hash</th>
                    <td>${result.header.data_hash}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Previous Block Hash</th>
                    <td>${result.header.previous_hash}</td>
                    </tr>`);
            var i = 1;
            for (let data of result.transactions) {
                info.append(createTransactionHTML(data, i++));
            }
        })
        .fail(function (e) {
            showBlockError(e);
        })
}

function getTransaction(id) {
    hideSearchError();

    $.get(`/api/v1/insight/org/org1/channel/${channelID}/tx/${id}`,
        {},
        function (result) {
            let container = $('#search-info-container');
            container.show();

            var info = $('#search-info');
            info.html("");
            info.append(createTransactionHTML(result, -1));
        })
        .fail(function (e) {
            showSearchError(e);
        })
}

function getLog(id, chaincode) {
    hideSearchError();

    $.get(`/api/v1/insight/org/org1/channel/${channelID}/chaincode/${chaincode}/id/${id}`,
        {},
        function (result) {
            let container = $('#object-info-container');
            container.show();

            var info = $('#object-info');
            info.html("");
            info.append(`<tr>
                    <th>ID</th>
                    <td>${result.id}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>CTE</th>
                    <td>${result.cte}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Supplychain ID</th>
                    <td>${result.supplychain_id}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Time</th>
                    <td>${result.time}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>References</th>
                    <td>${result.ref.join(' ,')}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Location</th>
                    <td>${result.location}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Product</th>
                    <td>${result.product}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Asset</th>
                    <td>${result.asset}</td>
                    </tr>`);
            info.append(`<tr>
                    <th>Content</th>
                    <td><pre>${JSON.stringify(JSON.parse(result.content), null, 2)}</pre></td>
                    </tr>`);
        })
        .fail(function (e) {
            showSearchError(e);
        })
}

function getChannelInfo() {
    hideChannelError();

    $.get(`/api/v1/insight/org/org1/channel/${channelID}`,
        {},
        function (result) {
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
    $.get(`/api/v1/insight/org/org1/channel/${channelID}/chaincodes`,
        {},
        function (result) {
            var select = $('#select-search-chaincode');
            select.html("");
            select.append(`<option disabled selected value='0'> -- select a chaincode -- </option>`);
            for (let chaincode of result) {
                select.append(`<option value="${chaincode.name}">${chaincode.name} - ${chaincode.version}</option>`);
            }
        })
}

function search() {
    $('#search-info').html('');
    $("#search-info-container").css("margin-top", "");
    $('#object-info').html('');
    let type = $('#select-search-type option:selected').val();
    let id = $('#text-object-search').val();
    if (id === '') {
        alert("Please provide ID");
        return;
    }

    switch (type) {
        case '1':
            getTransaction(id);
            break;
        case '2':
            let chaincode = $('#select-search-chaincode option:selected').val();
            if (chaincode === '0') {
                alert("Please Choose a chaincode");
                return;
            }
            getLog(id, chaincode);
            break;
        default: break;
    }
}

function searchTypeChanged(type) {
    let selectChaincode = $('#select-search-chaincode-container');
    switch (type) {
        case '1':
            selectChaincode.hide();
            break;
        case '2':
            selectChaincode.show();
            break;
        default: break;
    }
}