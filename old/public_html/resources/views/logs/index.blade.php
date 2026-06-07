@extends('layouts.app')

@section('content')
<section class="page-header row">
    <h2> Log <small> Storico attività applicativo </small></h2>
    <ol class="breadcrumb">
        <li><a href="{{ url('dashboard') }}">Dashboard</a></li>
        <li class="active">Log</li>
    </ol>
</section>
<div class="page-content row">
    <div class="page-content-wrapper no-margin">
        <div class="sbox">
            <div class="sbox-title">
                <h1>Log di sistema</h1>
            </div>
            <div class="sbox-content">
                <form method="GET" action="{{ url('logs') }}" class="form-inline m-b" role="form">
                    <div class="form-group" style="margin-left:10px;">
                        <label for="resource_id" class="control-label">ID preventivo</label>
                        <input type="text"
                               class="form-control input-sm"
                               name="resource_id"
                               id="resource_id"
                               value="{{ $selectedResourceId }}"
                               placeholder="Es. 1250"
                               @if(empty($selectedModule)) disabled @endif>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm" style="margin-left:10px;">Filtra</button>
                    <a href="{{ url('logs') }}" class="btn btn-default btn-sm" style="margin-left:5px;">Azzera</a>
                </form>

                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th style="width:90px;">Audit ID</th>
                                <th style="width:140px;">Data</th>
                                <th>Nota</th>
                                <th style="width:120px;">Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($logs as $log)
                                <tr>
                                    <td>{{ $log->auditID }}</td>
                                    <td>{{ \Carbon\Carbon::parse($log->logdate)->format('Y-m-d H:i') }}</td>
                                    <td>{{ $log->note }}</td>
                                    <td>
                                        @if($log->target_url)
                                            <a href="{{ $log->target_url }}" class="btn btn-xs btn-primary" title="Visualizza dettaglio">Visualizza</a>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="text-center text-muted">Nessun log disponibile.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="text-center">
                    {!! $logs->links() !!}
                </div>
            </div>
        </div>
    </div>
</div>
@push('scripts')
<script>
(function () {
    var moduleSelect = document.getElementById('module');
    var resourceInput = document.getElementById('resource_id');
    if (!moduleSelect || !resourceInput) {
        return;
    }
    function toggleResourceInput() {
        if (moduleSelect.value) {
            resourceInput.removeAttribute('disabled');
        } else {
            resourceInput.value = '';
            resourceInput.setAttribute('disabled', 'disabled');
        }
    }
    moduleSelect.addEventListener('change', toggleResourceInput);
    toggleResourceInput();
})();
</script>
@endpush
@stop
