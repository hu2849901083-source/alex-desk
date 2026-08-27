Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public enum EDataFlow { eRender = 0, eCapture = 1, eAll = 2 }
public enum ERole { eConsole = 0, eMultimedia = 1, eCommunications = 2 }

[ComImport, Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator {
    int EnumAudioEndpoints(EDataFlow dataFlow, int stateMask, out object devices);
    int GetDefaultAudioEndpoint(EDataFlow dataFlow, ERole role, out IMMDevice endpoint);
    int GetDevice(string id, out IMMDevice device);
    int RegisterEndpointNotificationCallback(IntPtr client);
    int UnregisterEndpointNotificationCallback(IntPtr client);
}

[ComImport, Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice {
    int Activate(ref Guid iid, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object instance);
    int OpenPropertyStore(int access, out IntPtr properties);
    int GetId([MarshalAs(UnmanagedType.LPWStr)] out string id);
    int GetState(out int state);
}

[ComImport, Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioMeterInformation {
    int GetPeakValue(out float peak);
    int GetMeteringChannelCount(out int channelCount);
    int GetChannelsPeakValues(int channelCount, [Out, MarshalAs(UnmanagedType.LPArray, SizeParamIndex = 0)] float[] peakValues);
    int QueryHardwareSupport(out int hardwareSupportMask);
}

public static class AlexDeskAudioMeter {
    static IAudioMeterInformation meter;

    static void Connect() {
        var type = Type.GetTypeFromCLSID(new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E"));
        var enumerator = (IMMDeviceEnumerator)Activator.CreateInstance(type);
        IMMDevice device;
        Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out device));
        var iid = new Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064");
        object instance;
        Marshal.ThrowExceptionForHR(device.Activate(ref iid, 23, IntPtr.Zero, out instance));
        meter = (IAudioMeterInformation)instance;
    }

    public static float Read() {
        if (meter == null) Connect();
        float peak;
        var result = meter.GetPeakValue(out peak);
        if (result != 0) {
            meter = null;
            Connect();
            Marshal.ThrowExceptionForHR(meter.GetPeakValue(out peak));
        }
        return Math.Max(0f, Math.Min(1f, peak));
    }
}
'@

$culture = [System.Globalization.CultureInfo]::InvariantCulture
while ($true) {
    try {
        $peak = [AlexDeskAudioMeter]::Read()
        [Console]::Out.WriteLine($peak.ToString("F5", $culture))
        [Console]::Out.Flush()
    } catch {
        [Console]::Error.WriteLine($_.Exception.Message)
        [Console]::Error.Flush()
    }
    Start-Sleep -Milliseconds 45
}
