import { addressToHex } from '@utils';

export interface TransactionConfirmProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  token: string;
  tokenName: string;
  spender: string;
  spenderName: string;
  calldata: string;
}

export const TransactionConfirm = ({
  opened,
  onClose,
  onConfirm,
  token,
  tokenName,
  spender,
  spenderName,
  calldata,
}: TransactionConfirmProps) => {
  if (!opened) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <h3>Confirm Revoke Transaction</h3>
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
            ⚠️ You are about to revoke approval for:
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Token:</strong> {addressToHex(token)} (
            {tokenName || 'Unknown'})
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Spender:</strong> {addressToHex(spender)} (
            {spenderName || 'Unknown'})
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Action:</strong> Set allowance to 0 (complete revocation)
          </p>
        </div>
        <div>
          <strong>Transaction Details:</strong>
          <div
            style={{
              fontSize: '12px',
              marginTop: '8px',
              padding: '8px',
              background: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #ddd',
              wordBreak: 'break-all',
            }}
          >
            <div>
              <strong>Function:</strong> approve(address,uint256)
            </div>
            <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>
              <strong>Spender:</strong> {addressToHex(spender)}
            </div>
            <div style={{ fontFamily: 'monospace' }}>
              <strong>Amount:</strong> 0 (revoke all)
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
              Gas limit and price will be estimated when you confirm
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <strong>Calldata:</strong>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              marginTop: '8px',
              padding: '8px',
              background: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #ddd',
              wordBreak: 'break-all',
            }}
          >
            {(() => {
              if (!calldata)
                return 'Calldata will be generated when transaction is prepared';
              // Function selector (first 4 bytes = 8 hex chars)
              const selector = calldata.slice(0, 10); // includes 0x
              // Parameters (remaining data in 32-byte chunks = 64 hex chars each)
              const params = calldata.slice(10);
              const chunks = [];
              for (let i = 0; i < params.length; i += 64) {
                chunks.push(params.slice(i, i + 64));
              }
              return (
                <>
                  <div>{selector}</div>
                  {chunks.map((chunk, index) => (
                    <div key={index}>0x{chunk}</div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
};
