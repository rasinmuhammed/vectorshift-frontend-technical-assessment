// Enhanced Responsive Validation Modal
import React, { useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiActivity, FiLoader } from 'react-icons/fi';

const ValidationModal = ({ 
  isOpen, 
  onClose, 
  validationResult, 
  isLoading, 
  isMobile = false, 
  isDark = false 
}) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Responsive overlay styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: isMobile ? '0' : '20px',
    animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Responsive modal styles
  const modalStyle = {
    background: isDark 
      ? 'linear-gradient(145deg, #1f1b2e 0%, #141322 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: isMobile ? '20px 20px 0 0' : '16px',
    padding: isMobile ? '24px 20px 32px' : '32px',
    maxWidth: isMobile ? '100vw' : '480px',
    width: isMobile ? '100%' : '90%',
    maxHeight: isMobile ? '85vh' : '70vh',
    overflowY: 'auto',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
    boxShadow: isDark
      ? '0 20px 60px rgba(105, 19, 224, 0.15), 0 8px 24px rgba(0, 0, 0, 0.4)'
      : '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    animation: isMobile 
      ? 'slideUpMobile 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    // Safe area adjustments for mobile
    paddingBottom: isMobile ? `max(32px, env(safe-area-inset-bottom))` : '32px',
  };

  // Header styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.15)' : 'rgba(59, 130, 246, 0.15)'}`,
  };

  const titleStyle = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '700',
    color: isDark ? '#f4f3ff' : '#0f172a',
    margin: 0,
    letterSpacing: '-0.025em',
  };

  const closeButtonStyle = {
    background: 'none',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    minHeight: '36px',
  };

  // Content area styles
  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minHeight: '120px',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Validating Pipeline</h2>
            <button 
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              <FiX size={16} />
            </button>
          </div>
          
          <div style={contentStyle}>
            <div style={{
              width: isMobile ? '48px' : '64px',
              height: isMobile ? '48px' : '64px',
              borderRadius: '50%',
              background: isDark 
                ? 'linear-gradient(135deg, #6913e0, #7c3aed)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              animation: 'pulse 2s infinite',
            }}>
              <FiLoader 
                size={isMobile ? 20 : 24} 
                color="white" 
                style={{ animation: 'spin 1s linear infinite' }}
              />
            </div>
            
            <div>
              <h3 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                color: isDark ? '#f4f3ff' : '#0f172a',
                margin: '0 0 8px 0',
              }}>
                Analyzing Pipeline
              </h3>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                margin: 0,
                lineHeight: '1.5',
              }}>
                Checking node connections and validating workflow structure...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results state
  if (validationResult) {
    const isValid = validationResult.is_dag && !validationResult.error;
    
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Pipeline Validation</h2>
            <button 
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              <FiX size={16} />
            </button>
          </div>
          
          <div style={contentStyle}>
            {/* Status Icon */}
            <div style={{
              width: isMobile ? '56px' : '72px',
              height: isMobile ? '56px' : '72px',
              borderRadius: '50%',
              background: isValid 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: isValid
                ? '0 8px 24px rgba(16, 185, 129, 0.3)'
                : '0 8px 24px rgba(239, 68, 68, 0.3)',
            }}>
              {isValid ? (
                <FiCheck size={isMobile ? 24 : 32} color="white" />
              ) : (
                <FiAlertCircle size={isMobile ? 24 : 32} color="white" />
              )}
            </div>

            {/* Status Message */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '700',
                color: isDark ? '#f4f3ff' : '#0f172a',
                margin: '0 0 8px 0',
              }}>
                {isValid ? 'Pipeline Valid!' : 'Validation Issues Found'}
              </h3>
              <p style={{
                fontSize: isMobile ? '14px' : '16px',
                color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                margin: 0,
                lineHeight: '1.5',
              }}>
                {isValid 
                  ? 'Your pipeline structure is valid and ready to run.'
                  : validationResult.error 
                    ? `Error: ${validationResult.error}`
                    : 'The pipeline contains cycles and is not a valid DAG.'
                }
              </p>
            </div>

            {/* Statistics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '12px' : '16px',
              width: '100%',
              marginBottom: '24px',
            }}>
              {/* Nodes Count */}
              <div style={{
                padding: isMobile ? '16px 12px' : '20px 16px',
                background: isDark 
                  ? 'rgba(31, 27, 46, 0.6)' 
                  : 'rgba(248, 250, 252, 0.8)',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: isDark ? '#6913e0' : '#3b82f6',
                  marginBottom: '4px',
                }}>
                  {validationResult.num_nodes}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Nodes
                </div>
              </div>

              {/* Edges Count */}
              <div style={{
                padding: isMobile ? '16px 12px' : '20px 16px',
                background: isDark 
                  ? 'rgba(31, 27, 46, 0.6)' 
                  : 'rgba(248, 250, 252, 0.8)',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: isDark ? '#6913e0' : '#3b82f6',
                  marginBottom: '4px',
                }}>
                  {validationResult.num_edges}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Connections
                </div>
              </div>

              {/* DAG Status - Full width on mobile */}
              <div style={{
                padding: isMobile ? '16px 12px' : '20px 16px',
                background: validationResult.is_dag
                  ? (isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                  : (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'),
                borderRadius: '12px',
                border: `1px solid ${
                  validationResult.is_dag
                    ? (isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)')
                    : (isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')
                }`,
                textAlign: 'center',
                gridColumn: isMobile ? '1 / -1' : 'auto',
              }}>
                <div style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: validationResult.is_dag
                    ? (isDark ? '#34d399' : '#059669')
                    : (isDark ? '#f87171' : '#dc2626'),
                  marginBottom: '4px',
                }}>
                  {validationResult.is_dag ? '✓' : '✗'}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: validationResult.is_dag
                    ? (isDark ? '#34d399' : '#059669')
                    : (isDark ? '#f87171' : '#dc2626'),
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {validationResult.is_dag ? 'Valid DAG' : 'Has Cycles'}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              style={{
                background: isValid
                  ? (isDark 
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #10b981, #059669)'
                    )
                  : (isDark 
                      ? 'linear-gradient(135deg, #6913e0, #7c3aed)'
                      : 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    ),
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: isMobile ? '14px 28px' : '16px 32px',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: isMobile ? '200px' : '240px',
                boxShadow: isValid
                  ? '0 4px 16px rgba(16, 185, 129, 0.3)'
                  : (isDark 
                      ? '0 4px 16px rgba(105, 19, 224, 0.3)'
                      : '0 4px 16px rgba(59, 130, 246, 0.3)'
                    ),
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-1px) scale(1.02)';
                  e.target.style.boxShadow = isValid
                    ? '0 6px 20px rgba(16, 185, 129, 0.4)'
                    : (isDark 
                        ? '0 6px 20px rgba(105, 19, 224, 0.4)'
                        : '0 6px 20px rgba(59, 130, 246, 0.4)'
                      );
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = isValid
                    ? '0 4px 16px rgba(16, 185, 129, 0.3)'
                    : (isDark 
                        ? '0 4px 16px rgba(105, 19, 224, 0.3)'
                        : '0 4px 16px rgba(59, 130, 246, 0.3)'
                      );
                }
              }}
              onTouchStart={(e) => {
                if (isMobile) {
                  e.target.style.transform = 'scale(0.98)';
                }
              }}
              onTouchEnd={(e) => {
                if (isMobile) {
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {isValid ? 'Continue' : 'Got it'}
            </button>
          </div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideUpMobile {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default ValidationModal;